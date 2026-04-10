import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { callBogAPI } from "@/lib/bog/client";
import { handleBogErrorGE } from "@/lib/bog/errorHandler";
import { recordPayment } from "@/lib/payments";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PRODUCT_PRICES: Record<string, number> = {
    monthly_plan: 0.01,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const sessionUser = await verifyToken(token);
        if (!sessionUser) return res.status(401).json({ message: "Unauthorized" });

        const dbUser = await prisma.user.findUnique({ where: { id: sessionUser.id } });
        if (!dbUser) return res.status(404).json({ message: "User not found" });
        if (!dbUser.isActivated) {
            return res.status(403).json({ message: "AUTH_ERROR_ACCOUNT_NOT_ACTIVATED" });
        }

        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ error: "კალათის ნივთები არასწორია" });

        const externalOrderId = uuidv4();

        // Calculate total from server-side prices, not client input
        const totalAmount = items.reduce((sum: number, i: any) => {
            const serverPrice = PRODUCT_PRICES[i.productId];
            if (serverPrice === undefined) {
                throw new Error(`Unknown product: ${i.productId}`);
            }
            return sum + (i.quantity || 1) * serverPrice;
        }, 0);

        const bogMetadata = {
            userId: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName,
        };

        if (process.env.TEST_MODE === "true") {
            const mockPaymentStatus = {
                order_status: { key: "completed", value: "წარმატებული" },
                purchase_units: {
                    request_amount: totalAmount,
                    currency_code: "GEL",
                },
                payment_detail: {
                    transaction_id: "TEST_TX_12345",
                    payer_identifier: "0000****0000",
                    code: "100",
                    code_description: "Successful payment",
                },
            };

            const result = await recordPayment(externalOrderId, dbUser.id, mockPaymentStatus);

            return res.status(200).json({
                externalOrderId,
                redirectUrl: `${process.env.BASE_URL}/payment-success`,
                testMode: true,
                result,
            });
        }

        const bogPayload = {
            callback_url: `${process.env.BASE_URL}/api/payments/callback`,
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
                success: `${process.env.BASE_URL}/payment-success`,
                fail: `${process.env.BASE_URL}/payment-failed`,
            },
            metadata: bogMetadata,
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
