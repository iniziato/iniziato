import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { callBogAPI } from "@/lib/bog/client";
import { handleBogErrorGE } from "@/lib/bog/errorHandler";
import { createPendingPayment, finalizePayment, markPaymentFailed } from "@/lib/payments";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PRODUCT_PRICES: Record<string, number> = {
    monthly_plan: 0.01,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    let externalOrderId: string | null = null;

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const sessionUser = await verifyToken(token);
        if (!sessionUser) {
            console.warn("[PAYMENT][CREATE] Unauthorized payment attempt");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const dbUser = await prisma.user.findUnique({ where: { id: sessionUser.id } });
        if (!dbUser) {
            console.warn("[PAYMENT][CREATE] User not found", { userId: sessionUser.id });
            return res.status(404).json({ message: "User not found" });
        }
        if (!dbUser.isActivated) {
            console.warn("[PAYMENT][CREATE] Unactivated user attempted payment", {
                userId: dbUser.id,
                email: dbUser.email,
            });
            return res.status(403).json({ message: "AUTH_ERROR_ACCOUNT_NOT_ACTIVATED" });
        }

        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.warn("[PAYMENT][CREATE] Invalid items", { userId: dbUser.id, items });
            return res.status(400).json({ error: "კალათის ნივთები არასწორია" });
        }

        externalOrderId = uuidv4();

        // Calculate total from server-side prices, not client input
        const totalAmount = items.reduce((sum: number, i: any) => {
            const serverPrice = PRODUCT_PRICES[i.productId];
            if (serverPrice === undefined) {
                throw new Error(`Unknown product: ${i.productId}`);
            }
            return sum + (i.quantity || 1) * serverPrice;
        }, 0);

        console.log("[PAYMENT][CREATE] Initiating payment", {
            externalOrderId,
            userId: dbUser.id,
            email: dbUser.email,
            totalAmount,
            currency: "GEL",
            items: items.map((i: any) => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        });

        // Persist a pending record BEFORE calling BOG so we can investigate any failure
        await createPendingPayment(externalOrderId, dbUser.id, totalAmount, "GEL");

        const bogMetadata = {
            userId: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.fullName,
        };

        if (process.env.TEST_MODE === "true") {
            console.log("[PAYMENT][CREATE][TEST_MODE] Auto-completing payment", {
                externalOrderId,
            });

            const result = await finalizePayment(
                externalOrderId,
                { key: "completed", value: "წარმატებული" },
                { request_amount: totalAmount, currency_code: "GEL" }
            );

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

        console.log("[PAYMENT][BOG] Calling BOG API", { externalOrderId });

        const bogResponse: any = await callBogAPI("/payments/v1/ecommerce/orders", "POST", bogPayload);

        if (bogResponse.error_code) {
            console.error("[PAYMENT][BOG] BOG returned error", {
                externalOrderId,
                error_code: bogResponse.error_code,
                error_message: bogResponse.error_message,
            });
            await markPaymentFailed(
                externalOrderId,
                `BOG error ${bogResponse.error_code}: ${bogResponse.error_message}`
            );

            const { ok, code, message } = handleBogErrorGE(
                bogResponse.error_code,
                bogResponse.error_message
            );
            if (!ok) return res.status(400).json({ code, message });
        }

        console.log("[PAYMENT][BOG] BOG responded with redirect URL", {
            externalOrderId,
            redirectUrl: bogResponse._links?.redirect?.href,
        });

        return res.status(200).json({
            redirectUrl: bogResponse._links.redirect.href,
            externalOrderId,
        });
    } catch (err: any) {
        console.error("[PAYMENT][CREATE] Unexpected error", {
            externalOrderId,
            message: err?.message,
            stack: err?.stack,
        });
        if (externalOrderId) {
            await markPaymentFailed(externalOrderId, err?.message || "unknown error");
        }
        return res.status(500).json({ error: "გადახდის შექმნა ვერ განხორციელდა" });
    }
}
