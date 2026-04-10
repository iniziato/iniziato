import { Resend } from "resend";

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
        console.error("Resend env vars are not configured (RESEND_API_KEY, RESEND_FROM_EMAIL)");
        return null;
    }
    return new Resend(process.env.RESEND_API_KEY);
}

function emailLayout(content: string): string {
    return `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-size: 28px; letter-spacing: 2px; margin: 0;">INIZIATO</h1>
            </div>
            ${content}
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Iniziato
            </div>
        </div>
    `;
}

export async function sendPasswordResetEmail(
    user: { email: string; fullName: string },
    resetLink: string
): Promise<{ ok: boolean; error?: string }> {
    const resend = getResendClient();
    if (!resend) return { ok: false, error: "Email service not configured" };

    const html = emailLayout(`
        <h2 style="font-size: 20px;">პაროლის აღდგენა</h2>
        <p>გამარჯობა ${user.fullName},</p>
        <p>თქვენ მოითხოვეთ პაროლის აღდგენა. დააჭირეთ ქვემოთ მოცემულ ღილაკს ახალი პაროლის დასაყენებლად:</p>
        <p style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600;">პაროლის აღდგენა</a>
        </p>
        <p style="color: #666; font-size: 14px;">ეს ლინკი მოქმედებს 15 წუთის განმავლობაში. თუ თქვენ არ მოგითხოვიათ პაროლის აღდგენა, უბრალოდ უგულებელყავით ეს წერილი.</p>
    `);

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "პაროლის აღდგენა - Iniziato",
            html,
        });
        if (error) {
            console.error("Resend password reset error:", error);
            return { ok: false, error: error.message };
        }
        return { ok: true };
    } catch (err) {
        console.error("Failed to send password reset email:", err);
        return { ok: false, error: "send failed" };
    }
}

export async function sendActivationEmail(
    user: { email: string; fullName: string },
    activationLink: string
): Promise<{ ok: boolean; error?: string }> {
    const resend = getResendClient();
    if (!resend) return { ok: false, error: "Email service not configured" };

    const html = emailLayout(`
        <h2 style="font-size: 20px;">გაააქტიურე შენი ანგარიში</h2>
        <p>გამარჯობა ${user.fullName},</p>
        <p>მადლობა, რომ დარეგისტრირდი Iniziato-ში! ანგარიშის გასააქტიურებლად დააჭირე ქვემოთ მოცემულ ღილაკს:</p>
        <p style="text-align: center; margin: 32px 0;">
            <a href="${activationLink}" style="display: inline-block; padding: 14px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600;">გააქტიურება</a>
        </p>
        <p style="color: #666; font-size: 14px;">ეს ლინკი მოქმედებს 24 საათის განმავლობაში. თუ შენ არ შეგიქმნია ანგარიში, უგულებელყავი ეს წერილი.</p>
    `);

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "გაააქტიურე შენი ანგარიში - Iniziato",
            html,
        });
        if (error) {
            console.error("Resend activation email error:", error);
            return { ok: false, error: error.message };
        }
        return { ok: true };
    } catch (err) {
        console.error("Failed to send activation email:", err);
        return { ok: false, error: "send failed" };
    }
}

export async function sendWelcomeEmail(user: { email: string; fullName: string }): Promise<void> {
    const resend = getResendClient();
    if (!resend) return;

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const html = emailLayout(`
        <h2 style="font-size: 20px;">კეთილი იყოს თქვენი მობრძანება, ${user.fullName}!</h2>
        <p>მადლობა, რომ შემოგვიერთდით Iniziato-ში.</p>
        <p>თქვენი წევრობა გააქტიურებულია და ახლა შეგიძლიათ ისარგებლოთ ჩვენი პილატესის კლასებით — ნებისმიერ დროს, ნებისმიერ ადგილას.</p>
        <p style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/classes" style="display: inline-block; padding: 14px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600;">დაიწყე ვარჯიში</a>
        </p>
        <p style="color: #666; font-size: 14px;">თუ რაიმე კითხვა გექნებათ, დაგვიკავშირდით — ჩვენ აქ ვართ თქვენი მოგზაურობის გასამარტივებლად.</p>
    `);

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "კეთილი იყოს თქვენი მობრძანება Iniziato-ში!",
            html,
        });
        if (error) console.error("Resend welcome email error:", error);
    } catch (err) {
        console.error("Failed to send welcome email:", err);
    }
}

export async function sendPaymentReceiptEmail(
    user: { email: string; fullName: string },
    payment: { orderId: string; amount: number; currency: string; createdAt: Date }
): Promise<void> {
    const resend = getResendClient();
    if (!resend) return;

    const formattedDate = new Intl.DateTimeFormat("ka-GE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(payment.createdAt);

    const html = emailLayout(`
        <h2 style="font-size: 20px;">გადახდის დადასტურება</h2>
        <p>გამარჯობა ${user.fullName},</p>
        <p>თქვენი გადახდა წარმატებით განხორციელდა. გმადლობთ Iniziato-ს არჩევისთვის!</p>

        <div style="background: #f7f7f7; border-radius: 6px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px;">გადახდის დეტალები</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #666;">შეკვეთის ნომერი:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${payment.orderId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">თანხა:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${payment.amount.toFixed(2)} ${payment.currency}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;">თარიღი:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedDate}</td>
                </tr>
            </table>
        </div>

        <p style="color: #666; font-size: 14px;">გთხოვთ შეინახოთ ეს წერილი როგორც გადახდის დასტური. თუ რაიმე კითხვა გექნებათ, დაგვიკავშირდით.</p>
    `);

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: user.email,
            subject: "გადახდის დადასტურება - Iniziato",
            html,
        });
        if (error) console.error("Resend payment receipt error:", error);
    } catch (err) {
        console.error("Failed to send payment receipt email:", err);
    }
}
