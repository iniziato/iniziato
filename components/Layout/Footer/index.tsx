import Link from "next/link";
import styles from "./Footer.module.scss";
import {useTranslation} from "react-i18next";
import {useIsLoggedIn} from "@/lib/auth";

export const Footer = () => {
    const {t} = useTranslation();
    const loggedIn = useIsLoggedIn();

    return (
        <footer className={styles.pageWidth}>
            <div className={styles.footer}>
                <div className={styles.top}>
                    <div className={styles.newsletter}>
                        <h2>{t("KEEP_IN_TOUCH")}</h2>
                        <p>იყავით პირველი, ვინც შეიტყობს ახალი გაკვეთილების ატვირთვის, სპეციალური ღონისძიებების და სხვა სიახლეების შესახებ.</p>
                    </div>
                    <div className={styles.social}>
                        <a href="https://www.instagram.com/iniziato_pilates/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={"/images/instagram.png"}
                                alt="Instagram"
                                className={styles.icon}
                            />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61573256434832/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={"/images/facebook.png"}
                                alt="Facebook"
                                className={styles.icon}
                            />
                        </a>
                        <a href="https://www.tiktok.com/@iniziatopilates/" target="_blank" rel="noopener noreferrer">
                            <img
                                src={"/images/tiktok.png"}
                                alt="TikTok"
                                className={styles.icon}
                            />
                        </a>
                    </div>
                </div>
                <div className={styles.links}>
                    <div className={styles.group}>
                        <h5>{t("CLASSES")}</h5>
                        <Link href="/classes" className={styles.link}>{t("ALL_CLASSES")}</Link>
                        {!loggedIn && (<Link href="/signup" className={styles.link}>{t("GET_STARTED")}</Link>)}
                    </div>

                    <div className={styles.group}>
                        <h5>{t("ABOUT")}</h5>
                        <Link href="/about" className={styles.link}>{t("ABOUT")}</Link>
                        <Link href="/contact" className={styles.link}>{t("CONTACT")}</Link>
                        <Link href="/faqs" className={styles.link}>FAQ</Link>
                    </div>

                    <div className={styles.group}>
                        <h5>{t("RESOURCES")}</h5>
                        <Link href="/terms">{t("TERMS_OF_USE")}</Link>
                    </div>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <div className={styles.pageWidth}>
                    <div className={styles.bottom}>
                        <p>
                            Copyright © {new Date().getFullYear()} INIZIATO. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
