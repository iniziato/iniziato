import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { callBogAPI } from "@/lib/bog/client";
import { handleBogErrorGE } from "@/lib/bog/errorHandler";
import { createUserAndPayment } from "@/lib/payments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { items, metadata } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: "კალათის ნივთები არასწორია" });

        if (!metadata || !metadata.fullName || !metadata.email || !metadata.password)
            return res.status(400).json({ error: "მომხმარებლის ინფორმაცია არასწორია" });

        const externalOrderId = uuidv4();

        const totalAmount = process.env.TEST_MODE === "true"
            ? 0
            : items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);

        // In TEST_MODE, skip real BOG call and simulate a successful payment
        if (process.env.TEST_MODE === "true") {
            const mockPaymentStatus = {
                order_status: { key: "completed", value: "წარმატებული" },
                payment_detail: {
                    transaction_id: "TEST_TX_12345",
                    payer_identifier: "0000****0000",
                    code: "100",
                    code_description: "Successful payment",
                },
            };

            // Insert user + payment into DB immediately
            const result = await createUserAndPayment(externalOrderId, metadata, mockPaymentStatus);

            return res.status(200).json({
                externalOrderId,
                redirectUrl: `${process.env.NGROK_URL}/payment-success`,
                testMode: true,
                result,
            });
        }

        const bogPayload = {
            callback_url: `${process.env.NGROK_URL}/api/payments/callback`,
            external_order_id: externalOrderId,
            capture: "automatic",
            language: "ka",
            purchase_units: {
                currency: "GEL",
                total_amount: totalAmount,
                basket: items.map((i) => ({
                    product_id: i.productId,
                    description: i.description,
                    quantity: i.quantity,
                    unit_price: i.unitPrice,
                })),
            },
            redirect_urls: {
                success: `${process.env.NGROK_URL}/payment-success`,
                fail: `${process.env.NGROK_URL}/payment-failed`,
            },
            metadata,
        };

        const bogResponse: any = await callBogAPI("/payments/v1/ecommerce/orders", "POST", bogPayload);

        if (bogResponse.error_code) {
            const { ok, code, message } = handleBogErrorGE(
                bogResponse.error_code,
                bogResponse.error_message
            );
            if (!ok) return res.status(400).json({ code, message });
        }

        return res.status(200).json({
            redirectUrl: bogResponse._links.redirect.href,
            externalOrderId,
        });
    } catch (err: any) {
        console.error("Create payment error:", err);
        return res.status(500).json({ error: `გადახდის შექმნა ვერ განხორციელდა: ${err.message}` });
    }
}