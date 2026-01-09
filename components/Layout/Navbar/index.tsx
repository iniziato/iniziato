"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/home";
    const isSignup = pathname === "/signup";
    const navbarClasses = `
        ${styles.nav} 
        ${isScrolled || !isHome ? styles.scrolled : ""} 
        ${isMobileMenuOpen ? styles.mobileOpen : ""}
    `;

    return (
        <nav
            className={navbarClasses}
            onMouseEnter={() => setIsNavbarHovered(true)}
            onMouseLeave={() => setIsNavbarHovered(false)}
        >
            <div className={styles.container}>
                <ul className={styles.links}>
                    <li><Link href="/classes">{t("CLASSES")}</Link></li>
                    <li><Link href="/about">{t("ABOUT")}</Link></li>
                    <li><Link href="/contact">{t("CONTACT")}</Link></li>
                </ul>

                <div className={styles.logo}>
                    <Link className={styles.logo} href="/home">INIZIATO</Link>
                </div>

                <ul className={styles.links}>
                    <li><Link href="/">{t("COMMUNITY")}</Link></li>
                    <li className={styles.profile}>
                        <Link href="/login">
                            <img
                                src={isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome ? "/images/profile-icon.svg" : "/images/profile-icon-white.svg"}
                                alt="Profile"
                                className={styles.profileIcon}
                            />
                        </Link>
                    </li>
                    {!isSignup && (
                        <li className={styles.cta}>
                            <Link href="/signup">{t("START_PILATES_TODAY")}</Link>
                        </li>
                    )}
                </ul>

                <div className={styles.mobileProfile}>
                    <img
                        src={isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome ? "/images/profile-icon.svg" : "/images/profile-icon-white.svg"}
                        alt="Profile"
                        className={styles.profileIcon}
                    />
                </div>

                <div
                    className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ""}`}
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
                <Link href="/classes">{t("CLASSES")}</Link>
                <Link href="/about">{t("ABOUT")}</Link>
                <Link href="/contact">{t("CONTACT")}</Link>
                <Link href="/">{t("COMMUNITY")}</Link>
                {!isSignup && (
                    <Link href="/signup" className={styles.mobileCta}>{t("START_PILATES_TODAY")}</Link>
                )}
            </div>
        </nav>
    );
};
