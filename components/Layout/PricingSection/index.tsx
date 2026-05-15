import styles from "./PricingSection.module.scss";
import {useTranslation} from "react-i18next";
import {useIsLoggedIn} from "@/lib/auth";

export const PricingSection = () => {
    const {t} = useTranslation();
    const loggedIn = useIsLoggedIn();

    return (
        <section className={styles.pricing}>
            <div className={styles.container}>
            <h2 className={styles.title}>{t("MEMBERSHIP_PRICING")}</h2>
                <div className={styles.pricingCards}>
                    <div className={styles.card}>
                        <span className={styles.saleBadge}>{t("LAUNCH_SALE")}</span>
                        <h3>{t("MONTHLY")}</h3>
                        <p className={styles.subtitle}>{t("PRICING_SUB")}</p>
                        <p className={styles.price}>
                            <span className={styles.oldPrice}>{t("PRICING_PRICE_OLD")}</span>
                            <span className={styles.newPrice}>{t("PRICING_PRICE")}</span>
                        </p>
                        <p className={styles.billing}>{t("PRICING_BILLING")}</p>
                    </div>
                </div>

                {!loggedIn && (
                    <div className={styles.centerButton}>
                        <a href="/signup" className={styles.button}>{t("START_HERE")}</a>
                    </div>
                )}
            </div>
        </section>
    );
};
