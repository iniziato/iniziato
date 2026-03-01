import { handleBogErrorGE } from "./errorHandler"

let cachedToken: string | null = null
let expiryTime = 0

export async function getBogToken(): Promise<string | null> {
    if (cachedToken && Date.now() < expiryTime) {
        return cachedToken
    }

    const credentials = Buffer.from(
        `${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`
    ).toString("base64")

    let res: Response
    try {
        res = await fetch(
            "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${credentials}`,
                },
                body: new URLSearchParams({ grant_type: "client_credentials" }),
            }
        )
    } catch (err: any) {
        const { message } = handleBogErrorGE(undefined, "BOG სერვერთან დაკავშირება ვერ მოხერხდა")
        throw new Error(`BOG Auth Failed: ${message} (${err.message})`)
    }

    if (!res.ok) {
        const text = await res.text()
        const { message } = handleBogErrorGE(undefined, "BOG ავთენტიკაცია ვერ განხორციელდა")
        throw new Error(`BOG Auth Failed: ${message} (${text})`)
    }

    const data = await res.json()

    if (!data.access_token) {
        const { message } = handleBogErrorGE(undefined, "BOG ავთენტიკაცია ვერ განხორციელდა: access_token არ არსებობს")
        throw new Error(`BOG Auth Failed: ${message}`)
    }

    cachedToken = data.access_token
    expiryTime = Date.now() + (data.expires_in - 60) * 1000

    return cachedToken;
}