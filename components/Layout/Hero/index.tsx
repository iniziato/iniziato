import { useEffect, useState } from "react";
import styles from "./Hero.module.scss";
import {useTranslation} from "react-i18next";

export const Hero = () => {
    const [loaded, setLoaded] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`${styles.hero} ${loaded ? styles.loaded : ""}`}>
            <img
                className={styles.video}
                src="/images/hero-poster.jpg"
                alt="hero-poster"></img>

            <div className={styles.overlay}></div>

            <div className="page-width">
                <div className={styles.content}>
                    <h2 className={styles.subtitle}>{t("FIND_YOUR_FLOW")}</h2>
                    <h1 className={styles.title}>{t("MOVES_FOR_EVERY_MOOD")}</h1>
                    <a
                        href="https://studio.thepilatesclass.com/"
                        className={styles.button}
                    >
                        {t("START_PILATES_TODAY")}
                    </a>
                </div>
            </div>
        </section>
    );
};
