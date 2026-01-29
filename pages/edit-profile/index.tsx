"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from './EditProfile.module.scss';
import { isLoggedIn, getToken } from "@/lib/auth"

interface UserProfile {
    fullName: string;
    email: string;
}

export default function EditProfile() {
    const { t } = useTranslation();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setUser({ fullName: data.fullName, email: data.email });
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const validate = () => {
        const e: any = {};
        if (!password) e.password = t("AUTH_ERROR_PASSWORD_REQUIRED");
        else if (password.length < 6)
            e.password = t("AUTH_ERROR_PASSWORD_MIN"); // add translation

        if (password !== confirmPassword)
            e.confirmPassword = t("AUTH_ERROR_PASSWORD_MISMATCH");

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await fetch("/api/auth/update-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMsg(t("AUTH_PASSWORD_UPDATED_SUCCESS"));
                setPassword("");
                setConfirmPassword("");
            } else {
                setErrors({ form: data.message || t("AUTH_PASSWORD_UPDATE_ERROR") });
            }
        } catch (err) {
            console.error(err);
            setErrors({ form: t("AUTH_PASSWORD_UPDATE_ERROR") });
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <section className={styles.editProfile}>
            <div className={styles.pageWidth}>
                <div className={styles.editProfileContainer}>
                    <h1 className={styles.title}>{t("EDIT_PROFILE_TITLE")}</h1>

                    {errors.form && (
                        <div className={styles.formError}>{errors.form}</div>
                    )}
                    {successMsg && (
                        <div className={styles.successMsg}>{successMsg}</div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                value={user?.fullName || ""}
                                disabled
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder={t("AUTH_PASSWORD")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <span className={styles.inputError}>{errors.password}</span>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder={t("AUTH_CONFIRM_PASSWORD")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && (
                                <span className={styles.inputError}>
                  {errors.confirmPassword}
                </span>
                            )}
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            {t("AUTH_UPDATE_PASSWORD")}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
