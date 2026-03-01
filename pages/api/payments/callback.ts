import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const signatureHeader = req.headers["callback-signature"] as string | undefined;
        const bodyRaw = JSON.stringify(req.body);

        // ✅ Verify signature (for production, use BOG public key & SHA256withRSA)
        if (!signatureHeader) {
            console.warn("No BOG signature header found");
            return res.status(403).json({ error: "No BOG signature header found" });
        }

        // Optionally: implement real RSA verification with BOG's public key here
        // For testing, we can skip signature verification temporarily
        const isValid = true; // TODO: replace with proper verification
        if (!isValid) {
            console.warn("BOG callback signature verification failed");
            return res.status(403).json({ error: "Invalid BOG callback signature" });
        }

        const order = req.body.body;
        if (!order) {
            return res.status(400).json({ error: "Invalid payload: missing order body" });
        }

        const isPaymentSuccessful = order.order_status?.key === "completed";

        if (isPaymentSuccessful && order.metadata) {
            const { fullName, email, password } = order.metadata;

            // 1️⃣ Create user if not exists
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await prisma.user.create({
                    data: { fullName, email, password }, // hash password in production!
                });
                console.log("Created user:", user.id);
            } else {
                console.log("User already exists:", user.id);
            }

            // 2️⃣ Create payment linked to user
            await prisma.payment.create({
                data: {
                    orderId: order.order_id,
                    externalOrderId: order.external_order_id,
                    status: order.order_status.key.toUpperCase(),
                    amount: parseFloat(order.purchase_units?.request_amount) || 0,
                    currency: order.purchase_units?.currency_code || "GEL",
                    user: { connect: { id: user.id } },
                },
            });
        } else {
            console.log(`Payment ${order.order_id} not completed. User not created.`);
        }

        return res.status(200).json({ received: true });
    } catch (err: any) {
        console.error("Callback error:", err);
        return res.status(500).json({ error: `Callback process failed: ${err.message}` });
    }
}