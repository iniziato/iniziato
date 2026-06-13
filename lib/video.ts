import { getToken } from "@/lib/auth";

/**
 * Converts a video path like "/videos/class1.mp4" to the authenticated API URL.
 * Returns the slug used by the API route.
 */
export function getVideoSlug(videoPath: string): string {
    // "/videos/class1.mp4" -> "class1"
    return videoPath.replace(/^\/videos\//, "").replace(/\.mp4$/, "");
}

/**
 * Requests short-lived video access (sets an HttpOnly cookie) and returns the
 * streaming URL. The URL itself carries no token, so it cannot be shared.
 *
 * The browser streams the URL with HTTP Range requests, so playback starts
 * after a small buffer instead of downloading the whole file first.
 */
export async function getVideoUrl(videoPath: string): Promise<string> {
    const slug = getVideoSlug(videoPath);
    const token = getToken();

    const response = await fetch("/api/videos/grant", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = new Error(`Video access denied: ${response.status}`);
        (error as Error & { status?: number }).status = response.status;
        throw error;
    }

    return `/api/videos/${slug}`;
}
