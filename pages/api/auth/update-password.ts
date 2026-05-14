import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    try {
        const token = req.headers.authorization?.split(" ")[1];
        const user = await verifyToken(token);
        if (!user) return res.status(401).json({ message: "AUTH_ERROR_UNAUTHORIZED" });

        const { currentPassword, password } = req.body;

        if (!currentPassword || !password) {
            return res.status(400).json({ message: "AUTH_ERROR_MISSING_FIELDS" });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: "AUTH_ERROR_PASSWORD_INVALID" });
        }

        // Verify current password
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser) return res.status(404).json({ message: "AUTH_ERROR_USER_NOT_FOUND" });

        const isCurrentValid = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isCurrentValid) {
            return res.status(401).json({ message: "AUTH_ERROR_CURRENT_PASSWORD_INCORRECT" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({ message: "AUTH_PASSWORD_UPDATED_SUCCESS" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "AUTH_PASSWORD_UPDATE_ERROR" });
    }
}
