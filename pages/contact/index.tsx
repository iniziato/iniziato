import { useTranslation } from "react-i18next";
import styles from "./Contact.module.scss";
import {PageHeaderWithPhoto} from "@/components/Layout/PageHeaderWithPhoto";

export default function Contact() {
    const { t } = useTranslation();

    return (
        <main className="contact">
            <PageHeaderWithPhoto title={t("HOW_CAN_WE_HELP")} subtitle={t("CONTACT_US")} backgroundImage="/images/hero-poster.jpg"/>
            <div className={styles.contactTemplate}>
                <div className={styles.pageWidth}>
                    <div className={styles.contactTemplateContainer}>
                        <p className={styles.contactTemplateText}>{t("CONTACT_TEXT")}</p>
                        <h2 className={styles.contactTemplateEmail}>help@pilatesbyketi.com</h2>
                    </div>
                </div>
            </div>
        </main>
    );
};

