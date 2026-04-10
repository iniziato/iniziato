import { prisma } from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/email";

export type PaymentStatus = "pending" | "completed" | "failed" | "rejected" | "refunded";

export async function createPendingPayment(
    externalOrderId: string,
    userId: string,
    amount: number,
    currency: string = "GEL"
) {
    console.log("[PAYMENT][PENDING] Creating pending payment", {
        externalOrderId,
        userId,
        amount,
        currency,
    });

    const payment = await prisma.payment.create({
        data: {
            userId,
            orderId: externalOrderId,
            externalOrderId,
            status: "pending",
            amount,
            currency,
        },
    });

    console.log("[PAYMENT][PENDING] Created pending payment", {
        paymentId: payment.id,
        externalOrderId,
    });

    return payment;
}

export async function finalizePayment(
    externalOrderId: string,
    bogOrderStatus: { key: string; value?: string },
    purchaseUnits?: { request_amount?: number | string; currency_code?: string }
) {
    const newStatus = (bogOrderStatus.key || "unknown").toLowerCase();

    console.log("[PAYMENT][FINALIZE] Finalizing payment", {
        externalOrderId,
        newStatus,
        statusValue: bogOrderStatus.value,
    });

    const existing = await prisma.payment.findUnique({
        where: { orderId: externalOrderId },
        include: { user: true },
    });

    if (!existing) {
        console.error("[PAYMENT][FINALIZE] Payment not found, cannot finalize", {
            externalOrderId,
        });
        throw new Error(`Payment not found: ${externalOrderId}`);
    }

    const wasAlreadyFinalized = existing.status !== "pending";

    if (wasAlreadyFinalized) {
        console.warn("[PAYMENT][FINALIZE] Payment already finalized, ignoring duplicate", {
            externalOrderId,
            previousStatus: existing.status,
            incomingStatus: newStatus,
        });
        return { user: existing.user, payment: existing, alreadyFinalized: true };
    }

    const updateData: { status: string; amount?: number; currency?: string } = {
        status: newStatus,
    };
    if (purchaseUnits?.request_amount != null) {
        updateData.amount = Number(purchaseUnits.request_amount);
    }
    if (purchaseUnits?.currency_code) {
        updateData.currency = purchaseUnits.currency_code;
    }

    const updated = await prisma.payment.update({
        where: { orderId: externalOrderId },
        data: updateData,
    });

    console.log("[PAYMENT][FINALIZE] Payment updated", {
        paymentId: updated.id,
        externalOrderId,
        status: updated.status,
        amount: updated.amount,
    });

    // Only send receipt on successful completion
    if (newStatus === "completed") {
        sendPaymentReceiptEmail(
            { email: existing.user.email, fullName: existing.user.fullName },
            {
                orderId: updated.orderId,
                amount: updated.amount,
                currency: updated.currency,
                createdAt: updated.createdAt,
            }
        ).catch((err) =>
            console.error("[PAYMENT][EMAIL] Receipt email failed", { externalOrderId, err })
        );
    }

    return { user: existing.user, payment: updated, alreadyFinalized: false };
}

export async function markPaymentFailed(externalOrderId: string, reason: string) {
    console.error("[PAYMENT][FAILED] Marking payment as failed", {
        externalOrderId,
        reason,
    });
    try {
        await prisma.payment.update({
            where: { orderId: externalOrderId },
            data: { status: "failed" },
        });
    } catch (err) {
        console.error("[PAYMENT][FAILED] Could not mark payment as failed", {
            externalOrderId,
            err,
        });
    }
}
