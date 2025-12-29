import styles from "./PageHeaderWithPhoto.module.scss";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export const PageHeaderWithPhoto = ({
                               title,
                               subtitle,
                               backgroundImage,
                           }: PageHeaderProps) => {
    const headerStyle: React.CSSProperties = {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }

    return (
        <header className={`${styles.pageHeader} desktopSmall mobileSmall`} style={headerStyle}>
            <div className={styles.overlay}></div>
            <div className={styles.pageWidth}>
                <div className={styles.pageHeaderContainer}>
                    <h1 className={styles.pageHeaderTitle}>{title}</h1>
                    {subtitle && <p className={styles.pageHeaderText}>{subtitle}</p>}
                </div>
            </div>
        </header>
    );
};
