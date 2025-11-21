import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { signEmailVerificationToken, signAccessToken, verifyEmailVerificationToken  } from "../core/security/jwt";
import {env} from "../config/env";
import { sendVerificationEmail } from "./mail.service";


export const authService = {
    async register(email: string, password: string) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new Error("Email already in use");
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await userRepository.create(email, hash);

        const token = signEmailVerificationToken({
            sub: user.id,
            email: user.email,
            type: "email_verification"
        })

        const verificationLink = `${env.apiBaseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

        await sendVerificationEmail(user.email, verificationLink);


        return user;
    },


    async verifyEmail(token: string) {
        const payload = verifyEmailVerificationToken(token);

        const user = await userRepository.findById(payload.sub);
        if (!user) {
            throw new Error("user not found");
        }

        if (user.status === "active" && (user as any).emailVerifiedAt) {
            return user;
        }

        return userRepository.verifyEmail(user.id);
    },


    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new Error("Invalid credentials");
        }
        await userRepository.update_lastLogin(user.id, new Date());
        return user;
    },

    async getUserByEmail(email: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
};