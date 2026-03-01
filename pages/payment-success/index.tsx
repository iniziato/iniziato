import { useTranslation } from "react-i18next";
import styles from "./PaymentSuccess.module.scss";
import {PageHeaderWithPhoto} from "@/components/Layout/PageHeaderWithPhoto";
import {withTranslations} from "@/lib/auth";

export default function PaymentSuccess() {
    const { t } = useTranslation();

    return (
        <main className="payment">
            <PageHeaderWithPhoto title={t("")} subtitle={t("")} backgroundImage="/images/hero-poster.jpg"/>
            <div className={styles.paymentTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.paymentTemplateContainer}>
                        <img
                            src="/images/check.svg"
                            alt="Logo"
                            className={styles.paymentLogo}
                        />
                        <p className={styles.paymentTemplateText}>{t("PAYMENT_SUCCESS_TEXT")}</p>
                        <button className={styles.paymentSubmitButton} onClick={()=> window.location.href='/classes'}>{t("CONTINUE_WORKOUT")}</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}

