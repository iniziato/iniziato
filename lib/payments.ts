import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function createUserAndPayment(
    externalOrderId: string,
    metadata: { fullName: string; email: string; password: string },
    paymentStatus: any
) {
    let user = await prisma.user.findUnique({ where: { email: metadata.email } });

    if (!user) {
        const hashedPassword = await hash(metadata.password, 10);

        user = await prisma.user.create({
            data: {
                email: metadata.email,
                fullName: metadata.fullName,
                password: hashedPassword,
            },
        });
    } else {
        console.log(`User already exists: ${user.id}`);
    }

    const payment = await prisma.payment.create({
        data: {
            userId: user.id,
            orderId: externalOrderId,
            externalOrderId,
            status: paymentStatus.order_status.key,
            amount: Number(paymentStatus.purchase_units?.request_amount || 0),
            currency: paymentStatus.purchase_units?.currency_code || "GEL",
        },
    });

    return { user, payment };
}