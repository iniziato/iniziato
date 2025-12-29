import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundColor?: string;
}

export const PageHeader = ({
                               title,
                               subtitle,
                               backgroundColor = "#4d423f",
                           }: PageHeaderProps) => {
    const headerStyle: React.CSSProperties = { backgroundColor };

    return (
        <header className={`${styles.pageHeader} desktopSmall mobileSmall`} style={headerStyle}>
            <div className={styles.pageWidth}>
                <div className={styles.pageHeaderContainer}>
                    <h1 className={styles.pageHeaderTitle}>{title}</h1>
                    {subtitle && <p className={styles.pageHeaderText}>{subtitle}</p>}
                </div>
            </div>
        </header>
    );
};
