import styles from "./IntroSection.module.scss";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const IntroSection = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.introSection}>
            <div className={styles.container}>
                <p >
                    {t("INTRO_TEXT")}
                    <span className={styles.highlight}>{t("INTRO_TEXT_2")}</span>
                    {t("INTRO_TEXT_3")}
                    <span className={styles.highlight}>{t("INTRO_TEXT_4")}</span>
                </p>
            </div>
        </section>
    );
};
