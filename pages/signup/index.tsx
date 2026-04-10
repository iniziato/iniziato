"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Signup.module.scss";
import { withTranslations } from "@/lib/auth";

export default function SignupPage() {
    const { t } = useTranslation();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [authError, setAuthError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateAll = () => {
        const e: any = {};
        if (!fullName) e.fullName = t("AUTH_ERROR_NAME_REQUIRED");
        if (!email) e.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = t("AUTH_ERROR_EMAIL_INVALID");
        if (!birthday) e.birthday = t("AUTH_ERROR_BIRTHDAY_REQUIRED");
        if (!password) e.password = t("AUTH_ERROR_PASSWORD_REQUIRED");
        else if (password.length < 6) e.password = t("AUTH_ERROR_PASSWORD_MIN");

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setSuccess(null);
        if (!validateAll()) return;

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password, birthday }),
            });

            const data = await res.json();

            if (!res.ok) {
                setAuthError(t(data.message || "AUTH_ERROR_REGISTER_FAILED"));
                return;
            }

            setSuccess(t("AUTH_SIGNUP_CHECK_EMAIL"));
        } catch (err: any) {
            setAuthError(err.message || t("AUTH_ERROR_REGISTER_FAILED"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.signupTemplate}>
            <div className={styles.signupImage}>
                <img src="/images/hero-poster.jpg" alt="Pilates workout" />
            </div>

            <div className={styles.signupContainer}>
                {authError && <div className={styles.authTemplateAuthError}>{authError}</div>}
                {success && <div className={styles.authTemplateSuccess}>{success}</div>}

                {!success && (
                    <form className={styles.singlePageForm} onSubmit={submitSignup}>
                        <div className={styles.accountSection}>
                            <h2>{t("SIGNUP_STEP_ACCOUNT")}</h2>

                            {errors.fullName && <div className={styles.authTemplateError}>{errors.fullName}</div>}
                            <input
                                type="text"
                                placeholder={t("AUTH_FULL_NAME")}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            {errors.email && <div className={styles.authTemplateError}>{errors.email}</div>}
                            <input
                                type="email"
                                placeholder={t("AUTH_EMAIL")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {errors.password && <div className={styles.authTemplateError}>{errors.password}</div>}
                            <input
                                type="password"
                                placeholder={t("AUTH_PASSWORD")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {errors.birthday && <div className={styles.authTemplateError}>{errors.birthday}</div>}
                            <input
                                type="date"
                                placeholder={t("AUTH_BIRTHDAY")}
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? t("AUTH_PROCESSING") : t("SIGNUP_SUBMIT")}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
