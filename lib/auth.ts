import jwt, {JwtPayload} from "jsonwebtoken";

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