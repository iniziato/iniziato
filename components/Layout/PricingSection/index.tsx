import styles from "./PricingSection.module.scss";
import {useTranslation} from "react-i18next";

export const PricingSection = () => {
    const {t} = useTranslation();

    return (
        <section className={styles.pricing}>
            <div className={styles.container}>
            <h2 className={styles.title}>{t("MEMBERSHIP_PRICING")}</h2>
                <div className={styles.pricingCards}>
                    <div className={styles.card}>
                        <h3>{t("MONTHLY")}</h3>
                        <p className={styles.subtitle}>{t("PRICING_SUB")}</p>
                        <p className={styles.price}>{t("PRICING_PRICE")}</p>
                        <p className={styles.billing}>{t("PRICING_BILLING")}</p>
                    </div>

                    <div className={styles.card}>
                        <h3>{t("QUARTERLY")}</h3>
                        <p className={styles.subtitle}>{t("PRICING_SUB_1")}</p>
                        <p className={styles.price}>{t("PRICING_PRICE_1")}</p>
                        <p className={styles.billing}>{t("PRICING_BILLING_1")}</p>
                    </div>
                </div>

                <div className={styles.centerButton}>
                    <a href="#" className={styles.button}>{t("START_HERE")}</a>
                </div>
            </div>
        </section>
    );
};
