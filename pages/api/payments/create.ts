import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { callBogAPI } from "@/lib/bog/client";
import { handleBogErrorGE } from "@/lib/bog/errorHandler";
import { createUserAndPayment } from "@/lib/payments";

const PRODUCT_PRICES: Record<string, number> = {
    monthly_plan: 79,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { items, metadata } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: "კალათის ნივთები არასწორია" });

        if (!metadata || !metadata.fullName || !metadata.email || !metadata.password)
            return res.status(400).json({ error: "მომხმარებლის ინფორმაცია არასწორია" });

        const externalOrderId = uuidv4();

        // Calculate total from server-side prices, not client input
        const totalAmount = items.reduce((sum: number, i: any) => {
            const serverPrice = PRODUCT_PRICES[i.productId];
            if (serverPrice === undefined) {
                throw new Error(`Unknown product: ${i.productId}`);
            }
            return sum + (i.quantity || 1) * serverPrice;
        }, 0);

        // Strip password from metadata sent to BOG
        const safeMetadata = {
            fullName: metadata.fullName,
            email: metadata.email,
            birthday: metadata.birthday,
        };

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

            const result = await createUserAndPayment(externalOrderId, metadata, mockPaymentStatus);

            return res.status(200).json({
                externalOrderId,
                redirectUrl: `${process.env.BASE_URL || process.env.NGROK_URL}/payment-success`,
                testMode: true,
                result,
            });
        }

        const bogPayload = {
            callback_url: `${process.env.BASE_URL || process.env.NGROK_URL}/api/payments/callback`,
            external_order_id: externalOrderId,
            capture: "automatic",
            language: "ka",
            purchase_units: {
                currency: "GEL",
                total_amount: totalAmount,
                basket: items.map((i: any) => ({
                    product_id: i.productId,
                    description: i.description,
                    quantity: i.quantity || 1,
                    unit_price: PRODUCT_PRICES[i.productId],
                })),
            },
            redirect_urls: {
                success: `${process.env.BASE_URL || process.env.NGROK_URL}/payment-success`,
                fail: `${process.env.BASE_URL || process.env.NGROK_URL}/payment-failed`,
            },
            metadata: safeMetadata,
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
        return res.status(500).json({ error: "გადახდის შექმნა ვერ განხორციელდა" });
    }
}
