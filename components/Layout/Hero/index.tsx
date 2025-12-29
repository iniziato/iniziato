import { useEffect, useState } from "react";
import styles from "./Hero.module.scss";
import {useTranslation} from "react-i18next";

export const Hero = () => {
    const [loaded, setLoaded] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100); // trigger fade-in animation
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`${styles.hero} ${loaded ? styles.loaded : ""}`}>
            <video
                className={styles.video}
                playsInline
                autoPlay
                loop
                muted
                preload="metadata"
                poster="/images/hero-poster.jpg"
            >
                <source
                    src="/videos/hero-video.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

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
