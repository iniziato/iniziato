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
 * Fetches a video through the authenticated API and returns a blob URL
 * that can be used as a video src.
 */
export async function fetchVideoUrl(videoPath: string): Promise<string> {
    const slug = getVideoSlug(videoPath);
    const token = getToken();

    const response = await fetch(`/api/videos/${slug}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to load video: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
