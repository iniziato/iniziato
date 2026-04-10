import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

interface ActivationTokenPayload extends JwtPayload {
    id: string;
    email: string;
    purpose: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "AUTH_ERROR_MISSING_TOKEN" });
        }

        let payload: ActivationTokenPayload;
        try {
            payload = jwt.verify(token, getJwtSecret()) as ActivationTokenPayload;
        } catch {
            return res.status(400).json({ message: "AUTH_ERROR_INVALID_OR_EXPIRED_LINK" });
        }

        if (payload.purpose !== "account-activation") {
            return res.status(400).json({ message: "AUTH_ERROR_INVALID_TOKEN" });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            return res.status(404).json({ message: "AUTH_ERROR_USER_NOT_FOUND" });
        }

        if (!user.isActivated) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isActivated: true },
            });

            // Fire-and-forget welcome email after activation
            sendWelcomeEmail({ email: user.email, fullName: user.fullName }).catch((err) =>
                console.error("Welcome email failed:", err)
            );
        }

        // Auto-login: issue a session JWT
        const sessionToken = jwt.sign(
            { id: user.id, email: user.email, fullName: user.fullName },
            getJwtSecret(),
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "AUTH_ACTIVATION_SUCCESS",
            token: sessionToken,
            user: { id: user.id, fullName: user.fullName, email: user.email },
        });
    } catch (error) {
        console.error("ACTIVATE ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
