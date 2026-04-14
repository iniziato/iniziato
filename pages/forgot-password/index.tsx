"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../contact/Contact.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";
import {withTranslations} from "@/lib/auth";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            setError(t("AUTH_ERROR_EMAIL_REQUIRED"));
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t("AUTH_ERROR_EMAIL_INVALID"));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSuccess(t("AUTH_FORGOT_PASSWORD_SUCCESS"));
            } else {
                setError(t("AUTH_PASSWORD_UPDATE_ERROR"));
            }
        } catch {
            setError(t("AUTH_PASSWORD_UPDATE_ERROR"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="forgot-password">
            <PageHeaderWithPhoto
                title={t("AUTH_FORGOT_PASSWORD")}
                subtitle={t("AUTH_FORGOT_PASSWORD_SUBTITLE")}
                backgroundImage="/images/hero-poster.jpeg"
            />

            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        {error && <div className={styles.authTemplateAuthError}>{error}</div>}
                        {success && <div className={styles.authTemplateSuccess}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder={t("AUTH_EMAIL")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.contactInput}
                            />
                            <button type="submit" className={styles.contactSubmitButton} disabled={loading}>
                                {t("AUTH_SEND_CODE")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}