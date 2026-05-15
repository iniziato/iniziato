import type { NextApiRequest, NextApiResponse } from "next";
import { finalizePayment } from "@/lib/payments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    if (process.env.TEST_MODE !== "true") {
        return res.status(403).json({ error: "Test mode is not enabled" });
    }

    const { externalOrderId } = req.body;

    if (!externalOrderId) {
        return res.status(400).json({ error: "Missing externalOrderId" });
    }

    try {
        console.log("[PAYMENT][TEST_CALLBACK] Manually finalizing payment", { externalOrderId });
        const result = await finalizePayment(
            externalOrderId,
            { key: "completed", value: "წარმატებული" },
            { request_amount: 55, currency_code: "GEL" }
        );
        res.status(200).json(result);
    } catch (err: any) {
        console.error("[PAYMENT][TEST_CALLBACK] Failed", { externalOrderId, err });
        res.status(500).json({ error: "Test callback failed" });
    }
}
