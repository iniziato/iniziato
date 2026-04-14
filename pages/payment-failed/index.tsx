import { useTranslation } from "react-i18next";
import styles from "./PaymentFailed.module.scss";
import {PageHeaderWithPhoto} from "@/components/Layout/PageHeaderWithPhoto";
import {withTranslations} from "@/lib/auth";

export default function PaymentFailed() {
    const { t } = useTranslation();

    return (
        <main className="payment">
            <PageHeaderWithPhoto title={t("")} subtitle={t("")} backgroundImage="/images/hero-poster.jpg"/>
            <div className={styles.paymentTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.paymentTemplateContainer}>
                        <img
                            src="/images/stop.svg"
                            alt="Logo"
                            className={styles.paymentLogo}
                        />
                        <p className={styles.paymentTemplateText}>{t("PAYMENT_FAILED_TEXT")}</p>
                        <button className={styles.paymentSubmitButton} onClick={()=> window.location.href='/home'}>{t("RETURN_TO_HOME_PAGE")}</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}

