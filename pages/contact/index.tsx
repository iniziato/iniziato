import { useTranslation } from "react-i18next";
import styles from "./Contact.module.scss";
import {PageHeader} from "@/components/Layout/PageHeader";
import {withTranslations} from "@/lib/i18n";

export default function Contact() {
    const { t } = useTranslation();

    return (
        <main className="contact">
            <PageHeader title={t("HOW_CAN_WE_HELP")} subtitle={t("CONTACT_US")}/>
            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        <p className={styles.contactTemplateText}>{t("CONTACT_TEXT")}</p>
                        <h2 className={styles.contactTemplateEmail}>iniziato26@gmail.com</h2>
                    </div>
                </div>
            </div>
        </main>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}

