"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./ClassesSection.module.scss";

const classKeys = [
    "beginner",
    "pilates_ball",
    "office",
    "pilates_ring",
    "band",
    "weights",
    "stretch"
] as const;

const classMedia: Record<
    (typeof classKeys)[number],
    { thumbnail: string; video?: string }
> = {
    beginner: {
        thumbnail: "/images/beginner.png",
        video: "/mini-videos/essentials.mp4",
    },
    pilates_ball: {
        thumbnail: "/images/pilates_ball.png",
        video: "/mini-videos/pilates_ball.mp4",
    },
    office: {
        thumbnail: "/images/office.png",
        video: "/mini-videos/office.mp4",
    },
    pilates_ring: {
        thumbnail: "/images/pilates_ring.png",
        video: "/mini-videos/pilates_ring.mp4",
    },
    band: {
        thumbnail: "/images/band.png",
        video: "/mini-videos/band.mp4",
    },
    weights: {
        thumbnail: "/images/weights.png",
        video: "/mini-videos/weights.mp4",
    },
    stretch: {
        thumbnail: "/images/stretch.JPG",
        video: "/mini-videos/stretch.mp4",
    },
};

export const ClassesSection = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("beginner");
    const [showLightbox, setShowLightbox] = useState(false);

    const classes = classKeys.map((key) => ({
        key,
        label: t(`CLASSES_ARRAY.${key}.LABEL`),
        description: t(`CLASSES_ARRAY.${key}.DESCRIPTION`),
        thumbnail: classMedia[key].thumbnail,
        video: classMedia[key].video,
    }));

    const activeClass = classes.find((c) => c.key === activeTab);

    const handlePlay = () => {
        if (!activeClass?.video) return;
        setShowLightbox(true);
    };

    const handleCloseLightbox = () => {
        setShowLightbox(false);
    };

    const renderDescription = (text: string) => {
        const blocks: Array<{ type: "text" | "list"; lines: string[] }> = [];
        for (const line of text.split("\n")) {
            const isBullet = /^\s*-\s+/.test(line);
            const wanted = isBullet ? "list" : "text";
            const last = blocks[blocks.length - 1];
            const value = isBullet ? line.replace(/^\s*-\s+/, "") : line;
            if (last?.type === wanted) {
                last.lines.push(value);
            } else {
                blocks.push({ type: wanted, lines: [value] });
            }
        }
        return blocks.map((block, i) =>
            block.type === "list" ? (
                <ul key={i}>
                    {block.lines.map((l, j) => (
                        <li key={j}>{l}</li>
                    ))}
                </ul>
            ) : (
                <p key={i}>{block.lines.join("\n")}</p>
            )
        );
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
                        {classes.map((item) => (
                            <Image
                                key={item.key}
                                src={item.thumbnail}
                                alt={item.label}
                                fill
                                sizes="(max-width: 900px) 100vw, 60vw"
                                priority={item.key === "beginner"}
                                className={`${styles.thumbnail} ${
                                    activeTab === item.key ? styles.thumbnailActive : ""
                                }`}
                            />
                        ))}
                    </div>

                    {activeClass?.video && (
                        <button
                            className={styles.playButton}
                            onClick={handlePlay}
                        >
                            ▶
                        </button>
                    )}
                </div>
                <div className={styles.text}>
                    {activeClass && renderDescription(activeClass.description)}

                    <a href="/classes" className={styles.button}>
                        {t("OUR_CLASSES")}
                    </a>
                </div>
            </div>

            {showLightbox && activeClass?.video && (
                <div
                    className={styles.lightbox}
                    onClick={handleCloseLightbox}
                >
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            controls
                            autoPlay
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                            className={styles.lightboxVideo}
                        >
                            <source src={activeClass.video} type="video/mp4" />
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
