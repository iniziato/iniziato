import { useTranslation } from "react-i18next";
import styles from "./PaymentSuccess.module.scss";
import {withTranslations} from "@/lib/i18n";

export default function PaymentSuccess() {
    const { t } = useTranslation();

    return (
        <main className="payment">
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

