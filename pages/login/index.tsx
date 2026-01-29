"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import styles from "./Login.module.scss";
import { isLoggedIn } from "@/lib/auth"; // import auth helper

type Errors = {
    email?: string;
    password?: string;
};

export default function LoginPage() {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [authError, setAuthError] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn()) {
            window.location.href = "/videos"; // redirect logged-in users
        } else {
            setCheckingAuth(false); // allow page to render if not logged in
        }
    }, []);

    const validate = () => {
        const nextErrors: Errors = {};

        if (!email) nextErrors.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            nextErrors.email = t("AUTH_ERROR_EMAIL_INVALID");

        if (!password) nextErrors.password = t("AUTH_ERROR_PASSWORD_REQUIRED");

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setAuthError(data.message || t("AUTH_ERROR_INVALID_CREDENTIALS"));
                return;
            }

            console.log("LOGIN SUCCESS", data);

            // Store JWT locally for now
            localStorage.setItem("token", data.token);

            // Redirect to protected page
            window.location.href = "/videos";
        } catch (err) {
            console.error("Login error:", err);
            setAuthError(t("AUTH_ERROR_INVALID_CREDENTIALS"));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (authError) setAuthError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (authError) setAuthError(null);
    };

    // Hide login form while checking auth
    if (checkingAuth) return null;

    return (
        <section className={styles.authTemplate}>
            <div className={styles.pageWidth}>
                <div className={styles.authTemplateContainer}>
                    <h1 className={styles.authTemplateTitle}>{t("AUTH_LOGIN_TITLE")}</h1>
                    <p className={styles.authTemplateText}>{t("AUTH_LOGIN_SUBTITLE")}</p>

                    {authError && (
                        <div className={styles.authTemplateAuthError}>{authError}</div>
                    )}

                    <form
                        className={styles.authTemplateForm}
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div>
                            <input
                                type="email"
                                placeholder={t("AUTH_EMAIL")}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {errors.email && (
                                <span className={styles.authTemplateError}>{errors.email}</span>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder={t("AUTH_PASSWORD")}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {errors.password && (
                                <span className={styles.authTemplateError}>{errors.password}</span>
                            )}
                        </div>

                        {/* Forgot Password link */}
                        <div className={styles.forgotPassword}>
                            <Link href="/forgot-password">{t("AUTH_FORGOT_PASSWORD")}</Link>
                        </div>

                        <button type="submit">{t("AUTH_LOGIN_BUTTON")}</button>
                    </form>

                    <div className={styles.authTemplateSwitch}>
                        {t("AUTH_NO_ACCOUNT")}{" "}
                        <Link className={styles.signUpLink} href="/signup">
                            {t("AUTH_SIGNUP")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
