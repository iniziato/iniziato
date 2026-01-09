"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Signup.module.scss";

type Plan = "monthly" | "quarterly";

export default function SignupPage() {
    const { t } = useTranslation();

    const [plan, setPlan] = useState<Plan>("monthly");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [authError, setAuthError] = useState<string | null>(null);

    const validateAll = () => {
        const e: any = {};
        if (!plan) e.plan = t("AUTH_ERROR_PLAN_REQUIRED");
        if (!fullName) e.fullName = t("AUTH_ERROR_NAME_REQUIRED");
        if (!email) e.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = t("AUTH_ERROR_EMAIL_INVALID");
        if (!password) e.password = t("AUTH_ERROR_PASSWORD_REQUIRED");
        if (!cardNumber) e.cardNumber = t("PAYMENT_ERROR_CARD_REQUIRED");
        if (!expiry) e.expiry = t("PAYMENT_ERROR_EXPIRY_REQUIRED");
        if (!cvc) e.cvc = t("PAYMENT_ERROR_CVC_REQUIRED");

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateAll()) return;

        // TODO: call backend / payment integration
        console.log({
            plan,
            fullName,
            email,
            password,
            cardNumber,
            expiry,
            cvc,
        });
    };

    return (
        <section className={styles.signupTemplate}>
            <div className={styles.signupImage}>
                <img src="/images/hero-poster.jpg" alt="Pilates workout" />
            </div>

            <div className={styles.signupContainer}>
                {authError && (
                    <div className={styles.authTemplateAuthError}>{authError}</div>
                )}

                <form className={styles.singlePageForm} onSubmit={submitSignup}>
                    <div className={styles.planSection}>
                        <h2>{t("SIGNUP_STEP_PLAN")}</h2>
                        <div className={styles.planCards}>
                            <label
                                className={`${styles.planCard} ${
                                    plan === "monthly" ? styles.selected : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="plan"
                                    value="monthly"
                                    checked={plan === "monthly"}
                                    onChange={() => setPlan("monthly")}
                                />
                                <h3>{t("AUTH_PLAN_MONTHLY")}</h3>
                                <p>{t("AUTH_PLAN_MONTHLY_DESC")}</p>
                            </label>

                            <label
                                className={`${styles.planCard} ${
                                    plan === "quarterly" ? styles.selected : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="plan"
                                    value="quarterly"
                                    checked={plan === "quarterly"}
                                    onChange={() => setPlan("quarterly")}
                                />
                                <h3>{t("AUTH_PLAN_QUARTERLY")}</h3>
                                <p>{t("AUTH_PLAN_QUARTERLY_DESC")}</p>
                            </label>
                        </div>
                        {errors.plan && (
                            <div className={styles.authTemplateError}>{errors.plan}</div>
                        )}
                    </div>

                    <div className={styles.accountSection}>
                        <h2>{t("SIGNUP_STEP_ACCOUNT")}</h2>
                        <input
                            type="text"
                            placeholder={t("AUTH_FULL_NAME")}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        {errors.fullName && (
                            <div className={styles.authTemplateError}>{errors.fullName}</div>
                        )}

                        <input
                            type="email"
                            placeholder={t("AUTH_EMAIL")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <div className={styles.authTemplateError}>{errors.email}</div>
                        )}

                        <input
                            type="password"
                            placeholder={t("AUTH_PASSWORD")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <div className={styles.authTemplateError}>{errors.password}</div>
                        )}
                    </div>

                    <div className={styles.paymentWrapper}>
                        <h2>{t("PAYMENT_TITLE")}</h2>

                        <div className={styles.cardGroup}>
                            <input
                                type="text"
                                placeholder={t("PAYMENT_CARD_NUMBER")}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder={t("PAYMENT_EXPIRY")}
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder={t("PAYMENT_CVC")}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                            />
                        </div>

                        <div className={styles.summary}>
                            <span>{t("PAYMENT_TODAY_PAY")}</span>
                            <strong>{plan === "monthly" ? "₾79.00" : "₾209.00"}</strong>
                        </div>

                        {errors.cardNumber && (
                            <div className={styles.authTemplateError}>{errors.cardNumber}</div>
                        )}
                        {errors.expiry && (
                            <div className={styles.authTemplateError}>{errors.expiry}</div>
                        )}
                        {errors.cvc && (
                            <div className={styles.authTemplateError}>{errors.cvc}</div>
                        )}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        {t("SIGNUP_SUBMIT")}
                    </button>
                </form>
            </div>
        </section>
    );
}
