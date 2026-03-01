import { BogErrorCode, BogErrorMessagesGE } from "./errorCodes"

/**
 * Converts a BOG error code into a user-friendly Georgian message.
 * Falls back to raw message if unknown.
 */
export function handleBogErrorGE(errorCode?: string, rawMessage?: string) {
    if (!errorCode) {
        return { ok: false, message: rawMessage || "უცნობი შეცდომა გადახდის პროცესში" }
    }

    const code = Object.values(BogErrorCode).includes(errorCode as BogErrorCode)
        ? (errorCode as BogErrorCode)
        : BogErrorCode.UnknownResponse

    const message = BogErrorMessagesGE[code] || rawMessage || "უცნობი შეცდომა გადახდის პროცესში"

    return { ok: code === BogErrorCode.SuccessfulPayment, code, message }
}