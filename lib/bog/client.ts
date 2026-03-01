import { getBogToken } from "./auth"
import { handleBogErrorGE } from "./errorHandler"

export async function callBogAPI(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    body?: any
) {
    let token: string | null
    try {
        token = await getBogToken()
    } catch (err: any) {
        const { message } = handleBogErrorGE(undefined, err.message)
        throw new Error(`BOG ავთენტიკაცია ვერ განხორციელდა: ${message}`)
    }

    let res: Response
    try {
        res = await fetch(`https://api.bog.ge${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Accept-Language": "ka",
            },
            body: body ? JSON.stringify(body) : undefined,
        })
    } catch (err: any) {
        const { message } = handleBogErrorGE(undefined, "BOG სერვერთან დაკავშირება ვერ მოხერხდა")
        throw new Error(`${message}: ${err.message}`)
    }

    let responseBody: any
    try {
        responseBody = await res.json()
    } catch {
        responseBody = await res.text()
    }

    if (!res.ok) {
        const { message } = handleBogErrorGE(undefined, "BOG API გაუთვალისწინებელი შეცდომა")
        throw new Error(`${message}: ${JSON.stringify(responseBody)}`)
    }

    return responseBody;
}