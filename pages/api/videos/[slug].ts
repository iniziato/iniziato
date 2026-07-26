import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Whitelist of allowed video filenames
const ALLOWED_VIDEOS = [
    "prep.mp4",
    "prep2.mp4",
    "prep3.mp4",
    "prep4.mp4",
    "prep5.mp4",
    "beginner.mp4",
    "beginner2.mp4",
    "beginner3.mp4",
    "band.mp4",
    "ball.mp4",
    "weights.mp4",
    "office.mp4",
    "stretch.mp4",
    "office1.mp4",
    "ring.mp4"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();

    // 1. Verify the HttpOnly video-access cookie. A <video> element cannot send
    //    custom headers, and keeping the token out of the URL means a shared
    //    URL carries no credentials and cannot be played by anyone else.
    const decoded = await verifyToken(req.cookies.video_token);
    if (!decoded) {
        return res.status(401).json({ error: "AUTH_ERROR_UNAUTHORIZED" });
    }

    // 2. Verify payment status
    const user = await prisma.user.findUnique({
        where: { email: decoded.email },
        include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (!user || user.payments.length === 0) {
        return res.status(403).json({ error: "AUTH_VIDEO_PAYMENT_REQUIRED" });
    }

    const lastPayment = user.payments[0];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (lastPayment.status.toLowerCase() !== "completed" || lastPayment.createdAt <= oneMonthAgo) {
        return res.status(403).json({ error: "AUTH_VIDEO_PAYMENT_EXPIRED" });
    }

    // 3. Validate and resolve video file
    const { slug } = req.query;
    const filename = `${slug}.mp4`;

    if (!ALLOWED_VIDEOS.includes(filename)) {
        return res.status(404).json({ error: "AUTH_VIDEO_NOT_FOUND" });
    }

    const videoPath = path.join(process.cwd(), "private", "videos", filename);

    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: "AUTH_VIDEO_NOT_FOUND" });
    }

    // 4. Stream video with Range support (for seeking)
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const stream = fs.createReadStream(videoPath, { start, end });
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
            "Cache-Control": "private, no-store",
        });
        stream.pipe(res);
    } else {
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
            "Cache-Control": "private, no-store",
        });
        fs.createReadStream(videoPath).pipe(res);
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
