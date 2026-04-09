import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendWelcomeEmail, sendPaymentReceiptEmail } from "@/lib/email";

export async function createUserAndPayment(
    externalOrderId: string,
    metadata: { fullName: string; email: string; password: string, birthday: string },
    paymentStatus: any
) {
    let user = await prisma.user.findUnique({ where: { email: metadata.email } });
    let isNewUser = false;

    if (!user) {
        const hashedPassword = await hash(metadata.password, 10);

        user = await prisma.user.create({
            data: {
                email: metadata.email,
                fullName: metadata.fullName,
                password: hashedPassword,
                birthday: metadata.birthday
            },
        });
        isNewUser = true;
    } else {
        console.log(`User already exists: ${user.id}`);
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

    // Fire-and-forget emails; do not block payment processing on failure
    if (isNewUser) {
        sendWelcomeEmail({ email: user.email, fullName: user.fullName }).catch((err) =>
            console.error("Welcome email failed:", err)
        );
    }

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
