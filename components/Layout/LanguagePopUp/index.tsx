import { useState, useEffect } from "react";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ka", label: "ქართული" },
];

export const LanguagePopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (!savedLang) {
            setShowPopup(true);
        }
    }, []);

    const selectLanguage = (lang: string) => {
        localStorage.setItem("language", lang);
        setShowPopup(false);
        window.location.reload();
    };

    if (!showPopup) return null;

    return (
        <div style={popupOverlay}>
            <div style={popupContainer}>
                <h3>Select Your Language</h3>
                <div style={popupButtons}>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code)}
                            style={popupButton}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple inline styles for popup
const popupOverlay: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
};

const popupContainer: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: "300px",
};

const popupButtons: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
};

const popupButton: React.CSSProperties = {
    padding: "10px 20px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#f8f8f8",
};
