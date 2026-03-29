import type { NextApiRequest, NextApiResponse } from "next";
import { createUserAndPayment } from "@/lib/payments";
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

    try {
        const signatureHeader = req.headers["callback-signature"] as string | undefined;

        if (!signatureHeader) {
            console.warn("No BOG signature header found");
            return res.status(403).json({ error: "Missing callback signature" });
        }

        // Read raw body before parsing to preserve field order for signature verification
        const rawBody = await getRawBody(req);

        // Verify SHA256withRSA signature using BOG's public key
        const verifier = crypto.createVerify("SHA256");
        verifier.update(rawBody);
        const isValid = verifier.verify(BOG_PUBLIC_KEY, signatureHeader, "base64");

        if (!isValid) {
            console.warn("BOG callback signature verification failed");
            return res.status(403).json({ error: "Invalid callback signature" });
        }

        // Parse body only after signature is verified
        const body = JSON.parse(rawBody.toString("utf-8"));
        const order = body.body;

        if (!order) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        const isPaymentSuccessful = order.order_status?.key === "completed";

        if (isPaymentSuccessful && order.metadata) {
            const { fullName, email, password, birthday } = order.metadata;

            await createUserAndPayment(
                order.external_order_id || order.order_id,
                { fullName, email, password, birthday },
                {
                    order_status: order.order_status,
                    purchase_units: order.purchase_units,
                }
            );
        } else {
            console.log(`Payment ${order.order_id} not completed.`);
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error("Callback error:", err);
        return res.status(500).json({ error: "Callback processing failed" });
    }
}
