import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "../core/security/jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.substring("Bearer ".length);

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" + err });
    }
}