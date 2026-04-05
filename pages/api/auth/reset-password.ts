import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";

interface ResetTokenPayload extends JwtPayload {
    id: string;
    email: string;
    purpose: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        let payload: ResetTokenPayload;
        try {
            payload = jwt.verify(token, getJwtSecret()) as ResetTokenPayload;
        } catch {
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }

        if (payload.purpose !== "password-reset") {
            return res.status(400).json({ message: "Invalid token" });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
