import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/Layout/PageHeader";
import { withTranslations } from "@/lib/i18n";
import { TERMS_TEXT } from "./termsText";
import styles from "./Terms.module.scss";

export default function Terms() {
    const { t } = useTranslation();

    return (
        <main className="terms">
            <PageHeader title={t("TERMS_OF_USE")} subtitle={t("LEGAL")} />
            <section className={styles.termsPage}>
                <div className={styles.container}>
                    <p className={styles.text}>{TERMS_TEXT}</p>
                </div>
            </section>
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
