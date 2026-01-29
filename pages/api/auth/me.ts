import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const user = await verifyToken(token);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        return res.status(200).json({ fullName: user.fullName, email: user.email });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}
