import jwt, {JwtPayload} from "jsonwebtoken";
import { loadTranslations } from "ni18n";
import {ni18nConfig} from "@/ni18n.config";

const TOKEN_KEY = "token";

interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
    fullName: string;
}
export const isLoggedIn = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
};

export async function verifyToken(token?: string): Promise<TokenPayload | null> {
    if (!token) return null;
    try {
        const secret = process.env.JWT_SECRET || "secret";
        return jwt.verify(token, secret) as TokenPayload;
    } catch (err) {
        console.error("JWT verification failed", err);
        return null;
    }
}

export const withTranslations = async (locale?: string) => {
    const lang = locale || "ka";

    const serverData = await loadTranslations(ni18nConfig, lang);
    const { resources, ns, lng } = serverData.__ni18n_server__;

    return {
        props: {
            initialI18nStore: { [lng as string]: { common: resources[lng as string] } },
            initialLocale: lng,
        },
    };
};