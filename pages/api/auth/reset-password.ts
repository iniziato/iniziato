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
            return res.status(400).json({ message: "AUTH_ERROR_MISSING_FIELDS" });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: "AUTH_ERROR_PASSWORD_INVALID" });
        }

        let payload: ResetTokenPayload;
        try {
            payload = jwt.verify(token, getJwtSecret()) as ResetTokenPayload;
        } catch {
            return res.status(400).json({ message: "AUTH_RESET_INVALID_LINK" });
        }

        if (payload.purpose !== "password-reset") {
            return res.status(400).json({ message: "AUTH_RESET_INVALID_LINK" });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            return res.status(404).json({ message: "AUTH_ERROR_USER_NOT_FOUND" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "AUTH_PASSWORD_UPDATED_SUCCESS" });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({ message: "AUTH_PASSWORD_UPDATE_ERROR" });
    }
}
