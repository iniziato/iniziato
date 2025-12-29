import { useTranslation } from "react-i18next";
import styles from './About.module.scss';
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";

export default function About() {
    const { t } = useTranslation();

    return (
        <main className="about">
            <PageHeaderWithPhoto
                title={t("ABOUT")}
                subtitle={t("KETI")}
                backgroundImage="/images/instructor.JPG"
            />

            <section className={styles.quote}>
                <div className="page-width">
                    <div className={styles.quoteContainer}>
                        <p className={styles.quoteSubtitle}>{t("IN_HER_WORDS")}</p>
                        <h2 className={styles.quoteHeading}>
                            “{t("QUOTE_TEXT")}”
                        </h2>
                    </div>
                </div>
            </section>

            <section className={styles.aboutTop}>
                <div className="page-width">
                    <div className={styles.topContainer}>
                        <div className={styles.topText}>
                            <h2 className={styles.topTitle}>{t("FROM_KETI")}</h2>
                            <p className={styles.topParagraph}>
                                {t("ABOUT_TOP_PARAGRAPH")}
                            </p>
                        </div>

                        <div className={styles.topImage}>
                            <img
                                src="/images/hero-poster.jpg"
                                alt={t("KETI_ALT")}
                                className={styles.responsiveImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.aboutMiddle}>
                <div className="page-width">
                    <h4 className={styles.middleText}>
                        {t("ABOUT_MIDDLE_TEXT")}
                    </h4>
                </div>
            </section>

            <section className={styles.aboutBottom}>
                <div className="page-width">
                    <div className={styles.bottomContainer}>
                        <div className={styles.bottomImage}>
                            <img
                                src="/images/hero-poster.jpg"
                                alt={t("PILATES_CLASS_BODY_ALT")}
                                className={styles.responsiveImage}
                            />
                        </div>

                        <div className={styles.bottomContent}>
                            <p className={styles.bottomText}>
                                {t("ABOUT_BOTTOM_TEXT_PART1")} <b>{t("THE_PILATES_CLASS_BODY")}</b> {t("ABOUT_BOTTOM_TEXT_PART2")}
                                <br /><br />
                                {t("ABOUT_BOTTOM_TEXT_PART3")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
