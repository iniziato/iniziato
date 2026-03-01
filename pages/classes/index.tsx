import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Classes.module.scss";
import { PageHeaderWithPhoto } from "@/components/Layout/PageHeaderWithPhoto";
import { IntensitySection } from "@/components/Layout/IntensitySection";
import { withTranslations } from "@/lib/auth";
import {jwtDecode} from "jwt-decode";
import { Popup } from "@/components/Layout/PopUp";

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
    const [canPlay, setCanPlay] = useState(false);
    const [activeVideo, setActiveVideo] = useState<VideoClass | null>(null);
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

    const handleVideoClick = (video: VideoClass) => {
        if (!loggedIn) {
            window.location.href = "/login";
            return;
        }

        if (!canPlay) {
            setShowPaymentPopup(true);
            return;
        }

        setActiveVideo(video);
    };

    const handlePayment = async () => {
        if (!userEmail) return;

        try {
            const response = await fetch("/api/payments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        {
                            productId: "monthly_plan",
                            description: "თვიური წევრობა",
                            quantity: 1,
                            unitPrice: 79,
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
                                    onClick={() => handleVideoClick(c)}
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
                <div className={styles.modal} onClick={() => setActiveVideo(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <video src={activeVideo.src} controls autoPlay playsInline />
                        <button className={styles.close} onClick={() => setActiveVideo(null)}>
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return await withTranslations(locale);
}