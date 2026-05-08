"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import styles from "../contact/Contact.module.scss";
import { PageHeader } from "@/components/Layout/PageHeader";
import { withTranslations } from "@/lib/i18n";

export default function ActivatePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!router.isReady) return;

        const token = router.query.token as string | undefined;
        if (!token) {
            setStatus("error");
            setErrorMessage(t("AUTH_ERROR_INVALID_OR_EXPIRED_LINK"));
            return;
        }

        const activate = async () => {
            try {
                const res = await fetch("/api/auth/activate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setErrorMessage(t(data.message || "AUTH_ERROR_INVALID_OR_EXPIRED_LINK"));
                    return;
                }

                localStorage.setItem("token", data.token);
                setStatus("success");
                setTimeout(() => {
                    router.push("/welcome");
                }, 1500);
            } catch {
                setStatus("error");
                setErrorMessage(t("AUTH_ERROR_INVALID_OR_EXPIRED_LINK"));
            }
        };

        activate();
    }, [router.isReady, router.query.token, router, t]);

    return (
        <main className="activate">
            <PageHeader
                title={t("AUTH_ACTIVATE_TITLE")}
                subtitle={t("AUTH_ACTIVATE_SUBTITLE")}
            />

            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        {status === "loading" && <p>{t("AUTH_ACTIVATING")}</p>}
                        {status === "success" && (
                            <div className={styles.authTemplateSuccess}>{t("AUTH_ACTIVATION_SUCCESS")}</div>
                        )}
                        {status === "error" && (
                            <div className={styles.authTemplateAuthError}>{errorMessage}</div>
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
