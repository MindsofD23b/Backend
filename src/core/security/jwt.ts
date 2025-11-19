import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from '../../config/env';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}


export function signAccessToken(payload: JwtPayload): string {
    const secret: Secret = env.jwtSecret;   // explizit als Secret
    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
}
export function verifyAccessToken(token: string): JwtPayload {
    const secret: Secret = env.jwtSecret;

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
    }

    return decoded as JwtPayload;
}