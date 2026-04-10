import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = await verifyToken(token);
        if (!decoded) return res.status(401).json({ error: "Unauthorized" });

        const email = decoded.email;
        if (!email) return res.status(400).json({ error: "Invalid token" });

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                payments: {
                    where: { status: "completed" },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        if (!user || user.payments.length === 0) {
            return res.status(200).json({ status: "none", canPlay: false });
        }

        const lastPayment = user.payments[0];

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const canPlay = lastPayment.createdAt > oneMonthAgo;

        return res.status(200).json({
            status: lastPayment.status,
            createdAt: lastPayment.createdAt,
            canPlay,
        });
    } catch (err: any) {
        return res.status(500).json({ error: "Could not fetch payment status" });
    }
}
