"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Signup.module.scss";
import { withTranslations } from "@/lib/auth";

type Plan = "monthly";

export default function SignupPage() {
    const { t } = useTranslation();

    const [plan] = useState<Plan>("monthly");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [authError, setAuthError] = useState<string | null>(null);

    const validateAll = () => {
        const e: any = {};
        if (!fullName) e.fullName = t("AUTH_ERROR_NAME_REQUIRED");
        if (!email) e.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = t("AUTH_ERROR_EMAIL_INVALID");
        if (!password) e.password = t("AUTH_ERROR_PASSWORD_REQUIRED");

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateAll()) return;

        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        {
                            productId: plan === "monthly" ? "monthly_plan" : "quarterly_plan",
                            description: plan === "monthly" ? "თვიური წევრობა" : "კვარტალური წევრობა",
                            quantity: 1,
                            unitPrice: plan === "monthly" ? 0.01 : 79,
                        },
                    ],
                    metadata: { fullName, email, password },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setAuthError(data.message || "გადახდა ვერ განხორციელდა");
                return;
            }

            window.location.href = data.redirectUrl;
        } catch (err: any) {
            setAuthError(err.message || "გადახდა ვერ განხორციელდა");
        }
    };

    return (
        <section className={styles.signupTemplate}>
            <div className={styles.signupImage}>
                <img src="/images/hero-poster.jpg" alt="Pilates workout" />
            </div>

            <div className={styles.signupContainer}>
                {authError && <div className={styles.authTemplateAuthError}>{authError}</div>}

                <form className={styles.singlePageForm} onSubmit={submitSignup}>
                    <div className={styles.planSection}>
                        <h2>{t("SIGNUP_STEP_PLAN")}</h2>
                        <div className={styles.planCards}>
                            <label className={`${styles.planCard} ${styles.selected}`}>
                                <input type="radio" name="plan" value="monthly" checked readOnly />
                                <h3>{t("AUTH_PLAN_MONTHLY")}</h3>
                                <p>{t("AUTH_PLAN_MONTHLY_DESC")}</p>
                            </label>
                        </div>
                    </div>

                    <div className={styles.accountSection}>
                        <h2>{t("SIGNUP_STEP_ACCOUNT")}</h2>

                        <input
                            type="text"
                            placeholder={t("AUTH_FULL_NAME")}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        {errors.fullName && <div className={styles.authTemplateError}>{errors.fullName}</div>}

                        <input
                            type="email"
                            placeholder={t("AUTH_EMAIL")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className={styles.authTemplateError}>{errors.email}</div>}

                        <input
                            type="password"
                            placeholder={t("AUTH_PASSWORD")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className={styles.authTemplateError}>{errors.password}</div>}
                    </div>

                    <div className={styles.paymentWrapper}>
                        <div className={styles.summary}>
                            <span>{t("PAYMENT_TODAY_PAY")}</span>
                            <strong>₾79.00</strong>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        {t("SIGNUP_SUBMIT")}
                    </button>
                </form>
            </div>
        </section>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}