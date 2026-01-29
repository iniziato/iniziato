"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../contact/Contact.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
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

        // TODO: call backend to send login code
        console.log("Send login code to:", email);
        setSuccess(t("AUTH_FORGOT_PASSWORD_SUCCESS"));
    };

    return (
        <main className="forgot-password">
            <PageHeaderWithPhoto
                title={t("AUTH_FORGOT_PASSWORD")}
                subtitle={t("AUTH_FORGOT_PASSWORD_SUBTITLE")}
                backgroundImage="/images/hero-poster.jpg"
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
                                className={styles.contactInput} // you can add this class in Contact.module.scss
                            />
                            <button type="submit" className={styles.contactSubmitButton}>
                                {t("AUTH_SEND_CODE")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
