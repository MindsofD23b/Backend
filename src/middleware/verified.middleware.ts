import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../core/security/jwt';
import { userRepository } from '../repositories/user.repository';
import {prisma} from "../config/db";
export async function verifiedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.substring("Bearer ".length);

    try{
        const payload = verifyAccessToken(token); // { sub, email, role, verified }
            req.user = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            };
        const user = await userRepository.findById(payload.sub);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (user.emailVerifiedAt == null) {
            return res.status(403).json({ error: "Email not verified" });
        }
        else{
            next();
        }
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}