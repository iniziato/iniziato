"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import styles from "./Login.module.scss";

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

    const validate = () => {
        const nextErrors: Errors = {};

        if (!email) {
            nextErrors.email = t("AUTH_ERROR_EMAIL_REQUIRED");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = t("AUTH_ERROR_EMAIL_INVALID");
        }

        if (!password) {
            nextErrors.password = t("AUTH_ERROR_PASSWORD_REQUIRED");
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        /**
         * Replace this with real auth call
         */
        const loginSuccess = false;

        if (!loginSuccess) {
            setAuthError(t("AUTH_ERROR_INVALID_CREDENTIALS"));
            return;
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

    return (
        <section className={styles.authTemplate}>
            <div className={styles.pageWidth}>
                <div className={styles.authTemplateContainer}>
                    <h1 className={styles.authTemplateTitle}>
                        {t("AUTH_LOGIN_TITLE")}
                    </h1>

                    <p className={styles.authTemplateText}>
                        {t("AUTH_LOGIN_SUBTITLE")}
                    </p>

                    {authError && (
                        <div className={styles.authTemplateAuthError}>
                            {authError}
                        </div>
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
                                <span className={styles.authTemplateError}>
                  {errors.email}
                </span>
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
                                <span className={styles.authTemplateError}>
                  {errors.password}
                </span>
                            )}
                        </div>

                        <button type="submit">
                            {t("AUTH_LOGIN_BUTTON")}
                        </button>
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
