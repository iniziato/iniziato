import type { NextApiRequest, NextApiResponse } from "next";
import { createUserAndPayment } from "@/lib/payments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    if (process.env.TEST_MODE !== "true") {
        return res.status(403).json({ error: "Test mode is not enabled" });
    }

    const { externalOrderId, metadata } = req.body;

    if (!externalOrderId || !metadata) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const mockPaymentStatus = {
        order_status: { key: "completed", value: "წარმატებული" },
        payment_detail: {
            transaction_id: "TEST_TX_12345",
            payer_identifier: "0000****0000",
            code: "100",
            code_description: "Successful payment",
        },
    };

    try {
        const result = await createUserAndPayment(externalOrderId, metadata, mockPaymentStatus);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ error: "Test callback failed" });
    }
}
