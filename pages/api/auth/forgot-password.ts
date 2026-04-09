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
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
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
            return res.status(500).json({ message: "Failed to send email" });
        }

        return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
