"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ClassesSection.module.scss";

const classKeys = [
    "essentials",
    "body",
    "office",
    "stretch",
    "breathwork",
] as const;

const classMedia: Record<
    (typeof classKeys)[number],
    { thumbnail: string; video?: string }
> = {
    essentials: {
        thumbnail: "/images/essentials-thumbnail.png",
        video: "/videos/essentials.mp4",
    },
    body: {
        thumbnail: "/images/body-thumbnail.jpg",
        video: "/videos/body.mp4",
    },
    office: {
        thumbnail: "/images/office-thumbnail.png",
        video: "/videos/office-workout.mp4",
    },
    stretch: {
        thumbnail: "/images/stretch-thumbnail.png",
        video: "/videos/stretch-workout.mp4",
    },
    breathwork: {
        thumbnail: "/images/hero-poster.jpg",
        video: "/videos/breathwork.mp4",
    },
};

export const ClassesSection = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("essentials");
    const [showLightbox, setShowLightbox] = useState(false);

    const classes = classKeys.map((key) => ({
        key,
        label: t(`CLASSES_ARRAY.${key}.LABEL`),
        description: t(`CLASSES_ARRAY.${key}.DESCRIPTION`),
        thumbnail: classMedia[key].thumbnail,
        video: classMedia[key].video,
    }));

    const activeClass = classes.find((c) => c.key === activeTab);

    return (
        <section className={styles.classPreview}>
            <div className={styles.header}>
                <h2>{t("OUR_CLASSES")}</h2>
            </div>

            {/* NAV */}
            <div className={styles.navWrapper}>
                {classes.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`${styles.navItem} ${
                            activeTab === item.key ? styles.active : ""
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
                <div className={styles.media}>
                    <div className={styles.aspect}>
                        {/* STATIC THUMBNAIL */}
                        <img
                            src={activeClass?.thumbnail}
                            alt={activeClass?.label}
                        />
                    </div>

                    {activeClass?.video && (
                        <button
                            className={styles.playButton}
                            onClick={() => setShowLightbox(true)}
                        >
                            ▶
                        </button>
                    )}
                </div>

                <div className={styles.text}>
                    <p>{activeClass?.description}</p>

                    <a href="/classes" className={styles.button}>
                        {t("OUR_CLASSES")}
                    </a>
                </div>
            </div>

            {/* LIGHTBOX */}
            {showLightbox && activeClass?.video && (
                <div
                    className={styles.lightbox}
                    onClick={() => setShowLightbox(false)}
                >
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking video
                    >
                        <video controls autoPlay className={styles.lightboxVideo}>
                            <source src={activeClass.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button
                            className={styles.lightboxClose}
                            onClick={() => setShowLightbox(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
