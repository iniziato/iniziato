import { prisma } from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/email";

export async function recordPayment(
    externalOrderId: string,
    userId: string,
    paymentStatus: any
) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error(`User not found for payment: ${userId}`);
    }

    const payment = await prisma.payment.create({
        data: {
            userId: user.id,
            orderId: externalOrderId,
            externalOrderId,
            status: paymentStatus.order_status.key.toLowerCase(),
            amount: Number(paymentStatus.purchase_units?.request_amount || 0),
            currency: paymentStatus.purchase_units?.currency_code || "GEL",
        },
    });

    // Fire-and-forget receipt; do not block payment processing on failure
    sendPaymentReceiptEmail(
        { email: user.email, fullName: user.fullName },
        {
            orderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency,
            createdAt: payment.createdAt,
        }
    ).catch((err) => console.error("Payment receipt email failed:", err));

    return { user, payment };
}
