import { useTranslation } from "react-i18next";
import styles from './About.module.scss';
import {withTranslations} from "@/lib/i18n";
import {PageHeader} from "@/components/Layout/PageHeader";

export default function About() {
    const { t } = useTranslation();

    return (
        <main className="about">
            <PageHeader title={t("ABOUT")} subtitle={t("KETI")}/>

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
        </main>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
