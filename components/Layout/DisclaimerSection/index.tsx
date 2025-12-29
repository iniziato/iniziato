import styles from "./DisclaimerSection.module.scss";
import {useTranslation} from "react-i18next";

export const DisclaimerSection = () => {
    const {t} = useTranslation();

    return (
        <main className={styles.disclaimerPage}>
            <div className={styles.container}>
                <p className={styles.text}>
                    {t("DISCLAIMER_TEXT")}
                </p>
            </div>
        </main>
    );
};
