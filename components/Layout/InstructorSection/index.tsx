import Link from "next/link";
import styles from "./InstructorSection.module.scss";
import {useTranslation} from "react-i18next";

export const InstructorSection = () => {
    const {t} = useTranslation();
    return (
        <section className={styles.instructor}>
            <div className={styles.container}>
                <h2 className={styles.title}>{t("MEET_YOUR_INSTRUCTOR")}</h2>

                <div className={styles.content}>
                    {/* Image */}
                    <div className={styles.imageWrapper}>
                        <div className={styles.aspectRatio}>
                            <img
                                src="/images/instructor.JPG"
                                alt="Instructor"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className={styles.text}>
                        <h3>{t("KETI")}</h3>
                        <p>{t("INSTRUCTOR_DESC")}</p>

                        <Link href="/signup" className={styles.button}>
                            {t("TRY_CLASS")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
