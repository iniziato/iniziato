import type { NextApiRequest, NextApiResponse } from "next";
import { createUserAndPayment } from "@/lib/payments"; // your helper to create user + payment in DB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { externalOrderId, metadata } = req.body;

    if (!externalOrderId || !metadata) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Simulate BOG completing the payment
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
        res.status(500).json({ error: err.message });
    }
}