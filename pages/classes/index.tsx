import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import styles from "./Classes.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";
import {IntensitySection} from "@/components/Layout/IntensitySection";
import { isLoggedIn } from "@/lib/auth"

type VideoClass = {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    level: string;
    src: string;
};

type Category = {
    key: string;
    heading: string;
    description: string;
    classes: VideoClass[];
};

export default function Classes() {
    const { t } = useTranslation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeVideo, setActiveVideo] = useState<VideoClass | null>(null);

    useEffect(() => {
        setLoggedIn(isLoggedIn());
    }, []);

    const categories: Category[] = [
        {
            key: "ESSENTIALS",
            heading: t("CLASS_CAT_ESSENTIALS_TITLE"),
            description: t("CLASS_CAT_ESSENTIALS_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_BODY"),
                    thumbnail: "/images/essentials-thumbnail.png",
                    duration: "15 min",
                    level: t("CLASS_LEVEL_SATISFYING"),
                    src: "/videos/class1.mp4",
                },
                {
                    id: "2",
                    title: t("CLASS_SLOW_BURN"),
                    thumbnail: "/images/stretch-thumbnail.png",
                    duration: "10 min",
                    level: t("CLASS_LEVEL_SATISFYING"),
                    src: "/videos/class2.mp4",
                },
            ],
        },
        {
            key: "BODY",
            heading: t("CLASS_CAT_BODY_TITLE"),
            description: t("CLASS_CAT_BODY_DESC"),
            classes: [
                {
                    id: "3",
                    title: t("CLASS_FULL_BODY_2"),
                    thumbnail: "/images/office-thumbnail.png",
                    duration: "12 min",
                    level: t("CLASS_LEVEL_INTENSE"),
                    src: "/videos/class3.mp4",
                },
            ],
        },
    ];

    return (
        <main className={styles.classes}>
            <PageHeaderWithPhoto
                title={t("CLASSES")}
                subtitle={t("PILATES_LIBRARY")}
                backgroundImage="/images/instructor.JPG"
            />
            <IntensitySection />

            <section className="page-width">
                {categories.map((cat) => (
                    <div key={cat.key} className={styles.category}>
                        <h2 className={styles.categoryTitle}>{cat.heading}</h2>
                        <p className={styles.categoryDesc}>{cat.description}</p>

                        <div className={styles.slider}>
                            {cat.classes.map((c) => (
                                <div
                                    key={c.id}
                                    className={styles.card}
                                    onClick={() => {
                                        if (loggedIn) setActiveVideo(c);
                                    }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img src={c.thumbnail} alt={c.title} />
                                        {!loggedIn ? (
                                            <button
                                                className={styles.startNowButton}
                                                onClick={() => (window.location.href = "/login")}
                                            >
                                                {t("GET_STARTED")}
                                            </button>
                                        ) : (
                                            <div className={styles.playOverlay}>▶</div>
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.topRow}>
                                            <p className={styles.title}>{c.title}</p>
                                            <span className={styles.duration}>{c.duration}</span>
                                        </div>
                                        <div className={styles.bottomRow}>
                                            <span className={styles.level}>{c.level}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {activeVideo && (
                <div
                    className={styles.modal}
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={activeVideo.src}
                            controls
                            autoPlay
                            playsInline
                        />
                        <button
                            className={styles.close}
                            onClick={() => setActiveVideo(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
