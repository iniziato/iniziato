import Link from "next/link";
import styles from "./Footer.module.scss";
import {useTranslation} from "react-i18next";

export const Footer = () => {
    const {t} = useTranslation();

    return (
        <footer className={styles.footer}>
            {/* Newsletter / social */}
            <div className={styles.top}>
                <div className={styles.newsletter}>
                    <h2>{t("KEEP_IN_TOUCH")}</h2>
                    <p>Be the first to know about new class drops, new instructors, special events and more.</p>
                    <form className={styles.form}>
                        <input type="email" placeholder={t("YOUR_EMAIL_ADDRESS")} />
                        <button type="submit">  &rarr;</button>
                    </form>
                </div>
                <div className={styles.social}>
                    <a href="https://www.instagram.com/thepilatesclass/" target="_blank" rel="noopener noreferrer">
                        <img
                            src={"/images/instagram.png"}
                            alt="Instagram"
                            className={styles.icon}
                        />
                    </a>
                    <a href="https://www.facebook.com/thepilatesclass/" target="_blank" rel="noopener noreferrer">
                        <img
                            src={"/images/facebook.png"}
                            alt="Facebook"
                            className={styles.icon}
                        />
                    </a>
                </div>
            </div>

            {/* Main links */}
            <div className={styles.links}>
                <div className={styles.group}>
                    <h5>{t("CLASSES")}</h5>
                    <Link href="/classes" className={styles.link}>{t("ALL_CLASSES")}</Link>
                    <Link href="/signup" className={styles.link}>{t("GET_STARTED")}</Link>
                </div>

                <div className={styles.group}>
                    <h5>{t("ABOUT")}</h5>
                    <Link href="/about" className={styles.link}>{t("ABOUT")}</Link>
                    <Link href="/contact" className={styles.link}>{t("CONTACT")}</Link>
                    <Link href="/faqs" className={styles.link}>FAQ</Link>
                </div>

                <div className={styles.group}>
                    <h5>{t("RESOURCES")}</h5>
                    <Link href="/terms-conditions">{t("TERMS_OF_SERVICE")}</Link>
                    <Link href="/privacy-policy">{t("PRIVACY_POLICY")}</Link>
                    <Link href="/disclaimer">{t("DISCLAIMER")}</Link>
                </div>
            </div>

            {/* Copyright */}
            {/*<div className={styles.bottom}>*/}
            {/*    <p>© {new Date().getFullYear()} Pilates by Keti. All rights reserved.</p>*/}
            {/*</div>*/}
        </footer>
    );
};
