import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "AUTH_ERROR_EMAIL_REQUIRED" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: "AUTH_FORGOT_PASSWORD_SUCCESS" });
        }

        const resetToken = jwt.sign(
            { id: user.id, email: user.email, purpose: "password-reset" },
            getJwtSecret(),
            { expiresIn: "15m" }
        );

        const baseUrl = process.env.BASE_URL || "http://localhost:3000";
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        const result = await sendPasswordResetEmail(user, resetLink);
        if (!result.ok) {
            return res.status(500).json({ message: "AUTH_PASSWORD_UPDATE_ERROR" });
        }

        return res.status(200).json({ message: "AUTH_FORGOT_PASSWORD_SUCCESS" });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({ message: "AUTH_PASSWORD_UPDATE_ERROR" });
    }
}
