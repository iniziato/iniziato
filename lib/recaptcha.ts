const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptcha(token: string | undefined | null): Promise<{
    ok: boolean;
    error?: string;
}> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    // If no secret configured, treat captcha as disabled (useful for local dev)
    if (!secret) {
        console.warn("[RECAPTCHA] No RECAPTCHA_SECRET_KEY configured, skipping verification");
        return { ok: true };
    }

    if (!token) {
        return { ok: false, error: "missing-token" };
    }

    try {
        const params = new URLSearchParams({ secret, response: token });
        const res = await fetch(RECAPTCHA_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });

        const data: any = await res.json();
        console.log("[RECAPTCHA] Verification result", {
            success: data.success,
            errorCodes: data["error-codes"],
        });

        if (!data.success) {
            return { ok: false, error: (data["error-codes"] || []).join(",") || "verify-failed" };
        }

        return { ok: true };
    } catch (err: any) {
        console.error("[RECAPTCHA] Verification request failed", { message: err?.message });
        return { ok: false, error: "request-failed" };
    }
}
