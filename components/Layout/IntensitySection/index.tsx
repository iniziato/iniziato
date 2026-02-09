import { useTranslation } from "react-i18next";
import styles from "./IntensitySection.module.scss";

export const IntensitySection = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.classIntensity}>
            <div className="page-width">
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {t("CLASS_INTENSITY_TITLE")}
                        </h2>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.item}>
                            <p className={styles.intensity}>{t("INTENSITY_CHILL")}</p>
                            <h3 className={styles.itemTitle}>
                                {t("INTENSITY_CHILL_TITLE")}
                            </h3>
                            <p className={styles.text}>
                                {t("INTENSITY_CHILL_TEXT")}
                            </p>
                        </div>

                        <div className={styles.item}>
                            <p className={styles.intensity}>
                                {t("INTENSITY_SATISFYING")}
                            </p>
                            <h3 className={styles.itemTitle}>
                                {t("INTENSITY_SATISFYING_TITLE")}
                            </h3>
                            <p className={styles.text}>
                                {t("INTENSITY_SATISFYING_TEXT")}
                            </p>
                        </div>

                        <div className={styles.item}>
                            <p className={styles.intensity}>
                                {t("INTENSITY_INTENSE")}
                            </p>
                            <h3 className={styles.itemTitle}>
                                {t("INTENSITY_INTENSE_TITLE")}
                            </h3>
                            <p className={styles.text}>
                                {t("INTENSITY_INTENSE_TEXT")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
