import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "AUTH_ERROR_MISSING_FIELDS" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "AUTH_ERROR_INVALID_CREDENTIALS" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "AUTH_ERROR_INVALID_CREDENTIALS" });
        }

        if (!user.isActivated) {
            return res.status(403).json({ message: "AUTH_ERROR_ACCOUNT_NOT_ACTIVATED" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, fullName: user.fullName },
            getJwtSecret(),
            // Keep members signed in for a month. A short TTL silently expired
            // sessions mid-use and surfaced as a misleading "repay" popup.
            { expiresIn: "30d" }
        );

        return res.status(200).json({
            message: "LOGIN_SUCCESS",
            user: { id: user.id, fullName: user.fullName, email: user.email },
            token,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
