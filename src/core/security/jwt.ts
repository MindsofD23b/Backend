import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from '../../config/env';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export interface EmailVerificationPayload {
    sub: string,
    email: string,
    type: "email_verification"
}

const secret: Secret = env.jwtSecret;

export function signAccessToken(payload: JwtPayload): string {
    // explizit als Secret
    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
}
export function verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
        throw new TypeError("Invalid token payload");
    }

    return decoded as JwtPayload;
}

export function signEmailVerificationToken(payload: EmailVerificationPayload): string {
    const options: SignOptions = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, secret, options)
}


export function verifyEmailVerificationToken(token: string): EmailVerificationPayload {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") {
        throw new TypeError("Invalid token payload");
    }
    const payload = decoded as EmailVerificationPayload;
    if (payload.type !== "email_verification") {
        throw new Error("Invalid token type");
    }
    return payload;
}