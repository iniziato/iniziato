import type { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from "jwt-decode";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

        const token = authHeader.split(" ")[1]; // Bearer <token>
        if (!token) return res.status(401).json({ error: "Invalid token" });

        const decoded: { email?: string } = jwtDecode(token);
        const email = decoded.email;
        if (!email) return res.status(400).json({ error: "Email not found in token" });

        const user = await prisma.user.findUnique({
            where: { email },
            include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
        });

        if (!user || user.payments.length === 0) {
            return res.status(200).json({ status: "none", canPlay: false });
        }

        const lastPayment = user.payments[0];

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const validStatuses = ["success", "completed"];
        const canPlay =
            validStatuses.includes(lastPayment.status.toLowerCase()) &&
            lastPayment.createdAt > oneMonthAgo;

        return res.status(200).json({
            status: lastPayment.status,
            createdAt: lastPayment.createdAt,
            canPlay,
        });
    } catch (err: any) {
        return res.status(500).json({ error: `Could not fetch payment status: ${err.message}` });
    }
}