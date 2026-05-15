import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Classes.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";
import { IntensitySection } from "@/components/Layout/IntensitySection";
import { withTranslations } from "@/lib/i18n";
import {jwtDecode} from "jwt-decode";
import { Popup } from "@/components/Layout/PopUp";
import { getVideoUrl } from "@/lib/video";

type VideoClass = {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    level: string;
    src: string;
    comingSoon?: boolean;
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
    const [canPlay, setCanPlay] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<{ email: string }>(token);
        setUserEmail(decoded.email);

        setLoggedIn(true);

        fetch("/api/payments/status", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCanPlay(data.canPlay))
            .catch(console.error);
    }, []);

    const handleVideoClick = async (video: VideoClass) => {
        if (video.comingSoon) return;
        if (!loggedIn) {
            window.location.href = "/login";
            return;
        }

        if (!canPlay) {
            setShowPaymentPopup(true);
            return;
        }

        // Grant short-lived access, then stream the URL directly with Range
        // requests so playback starts after a small buffer, not a full download.
        try {
            setActiveVideo(await getVideoUrl(video.src));
        } catch {
            setShowPaymentPopup(true);
        }
    };

    const handleCloseVideo = () => {
        setActiveVideo(null);
    };

    const handlePayment = async () => {
        if (!userEmail) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/payments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    items: [
                        {
                            productId: "monthly_plan",
                            description: "ყოველთვიური წევრობა",
                            quantity: 1,
                            unitPrice: 55,
                        },
                    ],
                    metadata: {
                        email: userEmail,
                        fullName: "ignored",
                        password: "ignored",
                    },
                }),
            });

            const data = await response.json();

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        } catch (err) {
            console.error("Payment creation failed:", err);
        }
    };

    const categories: Category[] = [
        {
            key: "BEGINNER",
            heading: t("CLASS_CAT_BEGINNER_TITLE"),
            description: t("CLASS_CAT_BEGINNER_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_BEGINNER"),
                    thumbnail: "/images/beginner1.png",
                    duration: "10 წთ",
                    level: t("INTENSITY_CHILL"),
                    src: "/videos/beginner.mp4",
                },
                {
                    id: "2",
                    title: t("CLASS_FULL_BEGINNER_1"),
                    thumbnail: "/images/beginner.png",
                    duration: "10 წთ",
                    level: t("INTENSITY_CHILL"),
                    src: "/videos/beginner2.mp4",
                },
                {
                    id: "3",
                    title: t("CLASS_FULL_BEGINNER_2"),
                    thumbnail: "/images/beginner2.png",
                    duration: "15 წთ",
                    level: t("INTENSITY_CHILL"),
                    src: "/videos/beginner3.mp4",
                },
            ],
        },
        {
            key: "BAND",
            heading: t("CLASS_CAT_BAND_TITLE"),
            description: t("CLASS_CAT_BAND_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_BAND"),
                    thumbnail: "/images/band.png",
                    duration: "15 წთ",
                    level: t("INTENSITY_INTENSE"),
                    src: "/videos/band.mp4",
                },
            ],
        },
        {
            key: "BALL",
            heading: t("CLASS_CAT_BALL_TITLE"),
            description: t("CLASS_CAT_BALL_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_BALL"),
                    thumbnail: "/images/pilates_ball.png",
                    duration: "15 წთ",
                    level: t("INTENSITY_SATISFYING_INTENSE"),
                    src: "/videos/ball.mp4",
                },
            ],
        },
        {
            key: "RING",
            heading: t("CLASS_CAT_RING_TITLE"),
            description: t("CLASS_CAT_RING_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_RING"),
                    thumbnail: "/images/pilates_ring.png",
                    duration: "15 წთ",
                    level: t("INTENSITY_SATISFYING"),
                    src: "/videos/ring.mp4",
                    comingSoon: true,
                },
            ],
        },
        {
            key: "WEIGHTS",
            heading: t("CLASS_CAT_WEIGHTS_TITLE"),
            description: t("CLASS_CAT_WEIGHTS_DESC"),
            classes: [
                {
                    id: "1",
                    title: t("CLASS_FULL_WEIGHTS"),
                    thumbnail: "/images/weights.png",
                    duration: "18 წთ",
                    level: t("INTENSITY_SATISFYING"),
                    src: "/videos/weights.mp4",
                },
            ],
        },
        {
            key: "OFFICE",
            heading: t("CLASS_CAT_OFFICE_TITLE"),
            description: t("CLASS_CAT_OFFICE_DESC"),
            classes: [
                {
                    id: "3",
                    title: t("CLASS_FULL_OFFICE_1"),
                    thumbnail: "/images/office.png",
                    duration: "5 წთ",
                    level: t("INTENSITY_SATISFYING_INTENSE"),
                    src: "/videos/office.mp4",
                },
            ],
        },
        {
            key: "STRETCHING",
            heading: t("CLASS_CAT_STRETCHING_TITLE"),
            description: t("CLASS_CAT_STRETCHING_DESC"),
            classes: [
                {
                    id: "3",
                    title: t("CLASS_FULL_STRETCH"),
                    thumbnail: "/images/stretch.JPG",
                    duration: "5 წთ",
                    level: t("INTENSITY_CHILL"),
                    src: "/videos/stretch.mp4",
                    comingSoon: true,
                },
            ],
        },
    ];

    const scrollToContent = () => {
        const target = document.getElementById("classes-content");
        if (target) target.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className={styles.classes}>
            <div className={styles.headerWrapper}>
                <PageHeaderWithPhoto
                    title={t("CLASSES")}
                    subtitle={t("PILATES_LIBRARY")}
                    backgroundImage="/images/instructor.JPG"
                />
                <button
                    type="button"
                    className={styles.scrollHint}
                    onClick={scrollToContent}
                    aria-label={t("SCROLL_TO_CLASSES")}
                >
                    <span className={styles.scrollHintLabel}>{t("SCROLL_TO_CLASSES")}</span>
                    <span className={styles.chevron}>⌄</span>
                </button>
            </div>
            <div id="classes-content">
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
                                    className={`${styles.card} ${c.comingSoon ? styles.comingSoonCard : ""}`}
                                    onClick={() => handleVideoClick(c)}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img src={c.thumbnail} alt={c.title} />
                                        {c.comingSoon ? (
                                            <div className={styles.comingSoonOverlay}>
                                                {t("COMING_SOON")}
                                            </div>
                                        ) : !loggedIn ? (
                                            <button
                                                className={styles.startNowButton}
                                                onClick={() => (window.location.href = "/login")}
                                            >
                                                {t("GET_STARTED")}
                                            </button>
                                        ) : (
                                            <div className={styles.playOverlay}>▶︎</div>
                                        )}
                                    </div>
                                    {!c.comingSoon && (
                                        <div className={styles.info}>
                                            <div className={styles.topRow}>
                                                <p className={styles.title}>{c.title}</p>
                                                <span className={styles.duration}>{c.duration}</span>
                                            </div>
                                            <div className={styles.bottomRow}>
                                                <span className={styles.level}>{c.level}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {showPaymentPopup && (
                    <Popup
                        title={t("EXPIRY_POPUP_TITLE")}
                        subtitle={t("EXPIRY_POPUP_SUBTITLE")}
                        buttonText={t("EXPIRY_POPUP_BTN_TEXT")}
                        onClose={() => setShowPaymentPopup(false)}
                        onButtonClick={handlePayment}
                    />
                )}
            </section>

            {activeVideo && (
                <div className={styles.modal} onClick={handleCloseVideo}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <video
                            src={activeVideo}
                            controls
                            autoPlay
                            playsInline
                            preload="auto"
                            controlsList="nocaptions nodownload"
                            crossOrigin="anonymous"
                            onError={() => {
                                setActiveVideo(null);
                                setShowPaymentPopup(true);
                            }}
                            onLoadedMetadata={(e) => {
                                const tracks = (e.currentTarget as HTMLVideoElement).textTracks;
                                for (let i = 0; i < tracks.length; i++) tracks[i].mode = "disabled";
                            }}
                        />
                        <button className={styles.close} onClick={handleCloseVideo}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
            </div>
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}
