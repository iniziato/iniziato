"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "../contact/Contact.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";
import { isLoggedIn, getToken, withTranslations } from "@/lib/auth";

export default function WelcomePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
            return;
        }
        setCheckingAuth(false);
    }, []);

    const handlePayNow = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/payments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    items: [
                        {
                            productId: "monthly_plan",
                            description: "ყოველთვიური წევრობა",
                            quantity: 1,
                        },
                    ],
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || data.error || t("AUTH_PAYMENT_ERROR"));
                return;
            }

            window.location.href = data.redirectUrl;
        } catch {
            setError(t("AUTH_PAYMENT_ERROR"));
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) return null;

    return (
        <main className="welcome">
            <PageHeaderWithPhoto
                title={t("AUTH_WELCOME_TITLE")}
                subtitle={t("AUTH_WELCOME_SUBTITLE")}
                backgroundImage="/images/hero-poster.jpeg"
            />

            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        <p>{t("AUTH_WELCOME_TEXT")}</p>

                        {error && <div className={styles.authTemplateAuthError}>{error}</div>}

                        <button
                            type="button"
                            onClick={handlePayNow}
                            className={styles.contactSubmitButton}
                            disabled={loading}
                        >
                            {loading ? t("AUTH_PROCESSING") : t("AUTH_PAY_NOW")}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
