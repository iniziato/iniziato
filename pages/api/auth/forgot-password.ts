import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";

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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Reset your password - Iniziato",
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2>Password Reset</h2>
                    <p>Hi ${user.fullName},</p>
                    <p>You requested to reset your password. Click the link below:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
                    <p style="margin-top: 20px; color: #666;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
                </div>
            `,
        });

        return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
