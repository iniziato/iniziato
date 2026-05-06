import { useTranslation } from "react-i18next";
import styles from "./Pricing.module.scss";
import { PageHeader } from "@/components/Layout/PageHeader";
import { PricingSection } from "@/components/Layout/PricingSection";
import { withTranslations } from "@/lib/i18n";

export default function Pricing() {
    const { t } = useTranslation();

    return (
        <main className="pricing">
            <PageHeader title={t("MEMBERSHIP_PRICING")} subtitle={t("PRICING_PAGE_SUBTITLE")} />

            <section className={styles.explainer}>
                <div className="page-width">
                    <div className={styles.container}>
                        <div className={styles.block}>
                            <h2 className={styles.heading}>{t("PRICING_HOW_IT_WORKS_TITLE")}</h2>
                            <p className={styles.text}>{t("PRICING_HOW_IT_WORKS_TEXT")}</p>
                        </div>

                        <div className={styles.block}>
                            <h2 className={styles.heading}>{t("PRICING_WHAT_IT_COSTS_TITLE")}</h2>
                            <p className={styles.text}>{t("PRICING_WHAT_IT_COSTS_TEXT")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <PricingSection />
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
