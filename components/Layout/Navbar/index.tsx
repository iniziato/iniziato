"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.scss";
import { isLoggedIn, logout } from "@/lib/auth";

export const Navbar = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setLoggedIn(isLoggedIn());
    }, []);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        window.location.href = "/";
    };

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
                {/* Left links */}
                <ul className={styles.links}>
                    <li><Link href="/classes">{t("CLASSES")}</Link></li>
                    <li><Link href="/about">{t("ABOUT")}</Link></li>
                    <li><Link href="/contact">{t("CONTACT")}</Link></li>
                </ul>

                {/* Logo */}
                <div className={styles.logo}>
                    <Link className={styles.logo} href="/home">INIZIATO</Link>
                </div>

                {/* Right links */}
                <ul className={styles.links}>
                    <li><Link href="/">{t("COMMUNITY")}</Link></li>

                    {loggedIn && (
                        <>
                            {/* Profile Icon */}
                            <li className={styles.profile}>
                                <Link href="/edit-profile">
                                    <img
                                        src={
                                            isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome
                                                ? "/images/profile-icon.svg"
                                                : "/images/profile-icon-white.svg"
                                        }
                                        alt="Profile"
                                        className={styles.profileIcon}
                                    />
                                </Link>
                            </li>

                            {/* Logout Icon */}
                            <li className={styles.profile}>
                                <img
                                    onClick={handleLogout}
                                    src={
                                        isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome
                                            ? "/images/logout.svg"
                                            : "/images/logout-white.svg"
                                    }
                                    alt="Logout"
                                    className={styles.profileIcon}
                                />
                            </li>
                        </>
                    )}

                    {!loggedIn && (
                        <li className={styles.profile}>
                            <Link href="/login">
                                <img
                                    src={
                                        isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome
                                            ? "/images/profile-icon.svg"
                                            : "/images/profile-icon-white.svg"
                                    }
                                    alt="Profile"
                                    className={styles.profileIcon}
                                />
                            </Link>
                        </li>
                    )}

                    {!isSignup && !loggedIn && (
                        <li className={styles.cta}>
                            <Link href="/signup">{t("START_PILATES_TODAY")}</Link>
                        </li>
                    )}
                </ul>

                {/* Mobile profile / logout */}
                <div className={styles.mobileProfile}>
                    {loggedIn ? (
                        <img
                            onClick={handleLogout}
                            src={
                                isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome
                                    ? "/images/logout.svg"
                                    : "/images/logout-white.svg"
                            }
                            alt="Logout"
                            className={styles.profileIcon}
                        />
                    ) : (
                        <Link href="/login">
                            <img
                                src={
                                    isScrolled || isMobileMenuOpen || isNavbarHovered || !isHome
                                        ? "/images/profile-icon.svg"
                                        : "/images/profile-icon-white.svg"
                                }
                                alt="Profile"
                                className={styles.profileIcon}
                            />
                        </Link>
                    )}
                </div>

                {/* Hamburger button */}
                <div
                    className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ""}`}
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
                {loggedIn && (
                    <Link href="/edit-profile" className={styles.mobileProfileLink}>
                        {t("EDIT_PROFILE_TITLE")}
                    </Link>
                )}
                <Link href="/classes">{t("CLASSES")}</Link>
                <Link href="/about">{t("ABOUT")}</Link>
                <Link href="/contact">{t("CONTACT")}</Link>
                <Link href="/">{t("COMMUNITY")}</Link>
                {!isSignup && !loggedIn && (
                    <Link href="/signup" className={styles.mobileCta}>
                        {t("START_PILATES_TODAY")}
                    </Link>
                )}
            </div>
        </nav>
    );
};
