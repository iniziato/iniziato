import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { verifyToken, getJwtSecret } from "@/lib/auth";

/**
 * Grants short-lived video access by setting an HttpOnly cookie.
 *
 * The <video> element streams /api/videos/[slug] with no token in the URL,
 * so a shared URL is useless: authorization lives only in this cookie, which
 * JavaScript cannot read and which expires within a couple of hours.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: "AUTH_ERROR_UNAUTHORIZED" });
    }

    const videoToken = jwt.sign(
        { id: decoded.id, email: decoded.email, fullName: decoded.fullName, scope: "video" },
        getJwtSecret(),
        { expiresIn: "2h" }
    );

    const isProd = process.env.NODE_ENV === "production";
    const cookie = [
        `video_token=${videoToken}`,
        "HttpOnly",
        "Path=/api/videos",
        "SameSite=Strict",
        "Max-Age=7200",
        ...(isProd ? ["Secure"] : []),
    ].join("; ");

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ ok: true });
}
