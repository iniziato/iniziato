"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchVideoUrl } from "@/lib/video";
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
        thumbnail: "/images/essentials-thumbnail.jpg",
        video: "/videos/essentials.mp4",
    },
    body: {
        thumbnail: "/images/body-thumbnail.jpg",
        video: "/videos/body.mp4",
    },
    office: {
        thumbnail: "/images/office-thumbnail.jpg",
        video: "/videos/office-workout.mp4",
    },
    stretch: {
        thumbnail: "/images/stretch-thumbnail.jpg",
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
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);

    const classes = classKeys.map((key) => ({
        key,
        label: t(`CLASSES_ARRAY.${key}.LABEL`),
        description: t(`CLASSES_ARRAY.${key}.DESCRIPTION`),
        thumbnail: classMedia[key].thumbnail,
        video: classMedia[key].video,
    }));

    const activeClass = classes.find((c) => c.key === activeTab);

    const handlePlay = async () => {
        if (!activeClass?.video) return;
        setVideoLoading(true);
        try {
            const url = await fetchVideoUrl(activeClass.video);
            setVideoUrl(url);
            setShowLightbox(true);
        } catch {
            window.location.href = "/login";
        } finally {
            setVideoLoading(false);
        }
    };

    const handleCloseLightbox = () => {
        setShowLightbox(false);
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            setVideoUrl(null);
        }
    };

    return (
        <section className={styles.classPreview}>
            <div className={styles.header}>
                <h2>{t("OUR_CLASSES")}</h2>
            </div>
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
            <div className={styles.content}>
                <div className={styles.media}>
                    <div className={styles.aspect}>
                        <img
                            src={activeClass?.thumbnail}
                            alt={activeClass?.label}
                        />
                    </div>

                    {activeClass?.video && (
                        <button
                            className={styles.playButton}
                            onClick={handlePlay}
                            disabled={videoLoading}
                        >
                            {videoLoading ? "..." : "▶"}
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

            {showLightbox && videoUrl && (
                <div
                    className={styles.lightbox}
                    onClick={handleCloseLightbox}
                >
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video controls autoPlay className={styles.lightboxVideo}>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button
                            className={styles.lightboxClose}
                            onClick={handleCloseLightbox}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
