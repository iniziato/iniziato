import React from "react";
import styles from "./PopUp.module.scss";

interface PopupProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    onClose: () => void;
    onButtonClick: () => void;
}

export const Popup: React.FC<PopupProps> = ({
                                                title,
                                                subtitle,
                                                buttonText,
                                                buttonLink,
                                                onClose,
                                                onButtonClick,
                                            }) => {
    const handleButtonClick = () => {
        if (buttonLink) {
            window.location.href = buttonLink;
        } else if (onButtonClick) {
            onButtonClick();
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>
                    ✕
                </button>
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {buttonText && (
                    <button className={styles.actionButton} onClick={handleButtonClick}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};