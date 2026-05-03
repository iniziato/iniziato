import jwt, {JwtPayload} from "jsonwebtoken";
import { useEffect, useState } from "react";

const TOKEN_KEY = "token";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set");
    return secret;
}

interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
    fullName: string;
}
export const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
};

export const useIsLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        setLoggedIn(!!localStorage.getItem(TOKEN_KEY));
    }, []);
    return loggedIn;
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
        return jwt.verify(token, getJwtSecret()) as TokenPayload;
    } catch (err) {
        console.error("JWT verification failed", err);
        return null;
    }
}

export { getJwtSecret };
