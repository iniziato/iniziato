import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";
import { sendActivationEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { fullName, email, password, birthday, captchaToken } = req.body;

        if (!fullName || !email || !password || !birthday) {
            return res.status(400).json({ message: "AUTH_ERROR_MISSING_FIELDS" });
        }

        if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(String(fullName).trim())) {
            return res.status(400).json({ message: "AUTH_ERROR_NAME_LATIN" });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: "AUTH_ERROR_PASSWORD_INVALID" });
        }

        const captcha = await verifyRecaptcha(captchaToken);
        if (!captcha.ok) {
            console.warn("[REGISTER] Captcha verification failed", {
                email,
                error: captcha.error,
            });
            return res.status(400).json({ message: "AUTH_ERROR_CAPTCHA_FAILED" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "AUTH_ERROR_EMAIL_TAKEN" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                birthday,
                isActivated: false,
            },
        });

        const activationToken = jwt.sign(
            { id: user.id, email: user.email, purpose: "account-activation" },
            getJwtSecret(),
            { expiresIn: "24h" }
        );

        const baseUrl = process.env.BASE_URL || "http://localhost:3000";
        const activationLink = `${baseUrl}/activate?token=${activationToken}`;

        const result = await sendActivationEmail(
            { email: user.email, fullName: user.fullName },
            activationLink
        );

        if (!result.ok) {
            // Roll back the user so they can try again with the same email
            await prisma.user.delete({ where: { id: user.id } });
            return res.status(500).json({ message: "AUTH_ERROR_ACTIVATION_EMAIL_FAILED" });
        }

        return res.status(201).json({
            message: "AUTH_SIGNUP_SUCCESS",
            email: user.email,
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
