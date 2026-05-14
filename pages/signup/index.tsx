"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import styles from "./Signup.module.scss";
import { withTranslations } from "@/lib/i18n";

const ReCAPTCHA = dynamic(
    () => import("react-google-recaptcha") as any,
    { ssr: false }
) as any;

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function SignupPage() {
    const { t } = useTranslation();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaKey, setCaptchaKey] = useState(0);
    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
    const [authError, setAuthError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const resetCaptcha = () => {
        setCaptchaToken(null);
        setCaptchaKey((k) => k + 1);
    };

    const computeErrors = () => {
        const e: any = {};
        if (!fullName) e.fullName = t("AUTH_ERROR_NAME_REQUIRED");
        else if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(fullName.trim()))
            e.fullName = t("AUTH_ERROR_NAME_LATIN");
        if (!email) e.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = t("AUTH_ERROR_EMAIL_INVALID");
        if (!birthday) e.birthday = t("AUTH_ERROR_BIRTHDAY_REQUIRED");
        if (!password) e.password = t("AUTH_ERROR_PASSWORD_REQUIRED");
        else if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
            e.password = t("AUTH_ERROR_PASSWORD_INVALID");
        if (!acceptTerms) e.acceptTerms = t("AUTH_ERROR_ACCEPT_TERMS_REQUIRED");
        if (RECAPTCHA_SITE_KEY && !captchaToken)
            e.captcha = t("AUTH_ERROR_CAPTCHA_REQUIRED");
        return e;
    };

    const liveErrors = computeErrors();
    const showError = (field: string) =>
        (touched[field] || errors[field]) ? liveErrors[field] : undefined;

    const validateAll = () => {
        const e = computeErrors();
        setErrors(e);
        setTouched({ fullName: true, email: true, birthday: true, password: true, acceptTerms: true, captcha: true });
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
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    birthday,
                    captchaToken,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setAuthError(t(data.message || "AUTH_ERROR_REGISTER_FAILED"));
                resetCaptcha();
                return;
            }

            setSuccess(t("AUTH_SIGNUP_CHECK_EMAIL"));
        } catch (err: any) {
            setAuthError(err.message || t("AUTH_ERROR_REGISTER_FAILED"));
            resetCaptcha();
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

                            {showError("fullName") && <div className={styles.authTemplateError}>{showError("fullName")}</div>}
                            <input
                                type="text"
                                placeholder={t("AUTH_FULL_NAME")}
                                value={fullName}
                                onChange={(e) => { setFullName(e.target.value); markTouched("fullName"); }}
                                onBlur={() => markTouched("fullName")}
                            />

                            {showError("email") && <div className={styles.authTemplateError}>{showError("email")}</div>}
                            <input
                                type="email"
                                placeholder={t("AUTH_EMAIL")}
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); markTouched("email"); }}
                                onBlur={() => markTouched("email")}
                            />

                            {showError("password") && <div className={styles.authTemplateError}>{showError("password")}</div>}
                            <input
                                type="password"
                                placeholder={t("AUTH_PASSWORD")}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); markTouched("password"); }}
                                onBlur={() => markTouched("password")}
                            />

                            {showError("birthday") && <div className={styles.authTemplateError}>{showError("birthday")}</div>}
                            <div className={styles.dateField}>
                                <input
                                    type="date"
                                    aria-label={t("AUTH_BIRTHDAY")}
                                    value={birthday}
                                    onChange={(e) => { setBirthday(e.target.value); markTouched("birthday"); }}
                                    onBlur={() => markTouched("birthday")}
                                    onClick={(e) => {
                                        const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                                        el.showPicker?.();
                                    }}
                                    className={birthday ? styles.dateFilled : styles.dateEmpty}
                                />
                                {!birthday && (
                                    <span className={styles.datePlaceholder}>
                                        {t("AUTH_BIRTHDAY")}
                                    </span>
                                )}
                            </div>

                            <label className={styles.acceptTerms}>
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => { setAcceptTerms(e.target.checked); markTouched("acceptTerms"); }}
                                />
                                <span>
                                    {t("AUTH_ACCEPT_TERMS_PREFIX")}
                                    <Link href="/terms" target="_blank" rel="noopener noreferrer">
                                        ინიციატოს წესებს & პირობებს
                                    </Link>
                                </span>
                            </label>
                            {showError("acceptTerms") && (
                                <div className={styles.authTemplateError}>{showError("acceptTerms")}</div>
                            )}

                            {RECAPTCHA_SITE_KEY && (
                                <div className={styles.captchaWrapper}>
                                    <ReCAPTCHA
                                        key={captchaKey}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        hl="ka"
                                        onChange={(token: string | null) => setCaptchaToken(token)}
                                        onExpired={() => setCaptchaToken(null)}
                                    />
                                </div>
                            )}
                            {showError("captcha") && (
                                <div className={styles.authTemplateError}>{showError("captcha")}</div>
                            )}
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
