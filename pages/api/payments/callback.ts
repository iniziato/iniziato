import type { NextApiRequest, NextApiResponse } from "next";
import { finalizePayment } from "@/lib/payments";
import crypto from "crypto";

const BOG_PUBLIC_KEY = process.env.BOG_PUBLIC_KEY?.replace(/\\n/g, "\n") || "";

// Verify signature BEFORE deserializing body, as per BOG docs
export const config = {
    api: {
        bodyParser: false,
    },
};

function getRawBody(req: NextApiRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    let externalOrderId: string | undefined;

    try {
        const signatureHeader = req.headers["callback-signature"] as string | undefined;

        if (!signatureHeader) {
            console.warn("[PAYMENT][CALLBACK] Missing signature header");
            return res.status(403).json({ error: "Missing callback signature" });
        }

        // Read raw body before parsing to preserve field order for signature verification
        const rawBody = await getRawBody(req);

        // Verify SHA256withRSA signature using BOG's public key
        const verifier = crypto.createVerify("SHA256");
        verifier.update(rawBody);
        const isValid = verifier.verify(BOG_PUBLIC_KEY, signatureHeader, "base64");

        if (!isValid) {
            console.warn("[PAYMENT][CALLBACK] Signature verification failed");
            return res.status(403).json({ error: "Invalid callback signature" });
        }

        // Parse body only after signature is verified
        const body = JSON.parse(rawBody.toString("utf-8"));
        const order = body.body;

        if (!order) {
            console.error("[PAYMENT][CALLBACK] Invalid payload: missing order body", {
                rawBody: rawBody.toString("utf-8"),
            });
            return res.status(400).json({ error: "Invalid payload" });
        }

        externalOrderId = order.external_order_id || order.order_id;

        console.log("[PAYMENT][CALLBACK] Received BOG callback", {
            externalOrderId,
            bogOrderId: order.order_id,
            statusKey: order.order_status?.key,
            statusValue: order.order_status?.value,
            metadataUserId: order.metadata?.userId,
            paymentDetail: order.payment_detail,
        });

        if (!externalOrderId) {
            console.error("[PAYMENT][CALLBACK] Missing externalOrderId in payload", { order });
            return res.status(400).json({ error: "Missing order ID" });
        }

        if (!order.order_status?.key) {
            console.error("[PAYMENT][CALLBACK] Missing order_status in payload", {
                externalOrderId,
                order,
            });
            return res.status(400).json({ error: "Missing order status" });
        }

        await finalizePayment(externalOrderId, order.order_status, order.purchase_units);

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error("[PAYMENT][CALLBACK] Error processing callback", {
            externalOrderId,
            message: err?.message,
            stack: err?.stack,
        });
        return res.status(500).json({ error: "Callback processing failed" });
    }
}
