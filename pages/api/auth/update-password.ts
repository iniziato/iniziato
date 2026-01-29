import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const user = await verifyToken(token);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update password" });
    }
}
