"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "../contact/Contact.module.scss";
import { PageHeader } from "@/components/Layout/PageHeader";
import { withTranslations } from "@/lib/i18n";

export default function ResetPassword() {
    const { t } = useTranslation();
    const router = useRouter();
    const { token } = router.query;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || password.length < 6) {
            setError(t("AUTH_ERROR_PASSWORD_MIN"));
            return;
        }

        if (password !== confirmPassword) {
            setError(t("AUTH_ERROR_PASSWORD_MISMATCH"));
            return;
        }

        if (!token) {
            setError(t("AUTH_RESET_INVALID_LINK"));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || t("AUTH_PASSWORD_UPDATE_ERROR"));
                return;
            }

            setSuccess(t("AUTH_PASSWORD_UPDATED_SUCCESS"));
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch {
            setError(t("AUTH_PASSWORD_UPDATE_ERROR"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="reset-password">
            <PageHeader
                title={t("AUTH_RESET_PASSWORD")}
                subtitle={t("AUTH_RESET_PASSWORD_SUBTITLE")}
            />

            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        {error && <div className={styles.authTemplateAuthError}>{error}</div>}
                        {success && <div className={styles.authTemplateSuccess}>{success}</div>}

                        {!success && (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="password"
                                    placeholder={t("AUTH_PASSWORD")}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.contactInput}
                                />
                                <input
                                    type="password"
                                    placeholder={t("AUTH_CONFIRM_PASSWORD")}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={styles.contactInput}
                                />
                                <button
                                    type="submit"
                                    className={styles.contactSubmitButton}
                                    disabled={loading}
                                >
                                    {t("AUTH_UPDATE_PASSWORD")}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
