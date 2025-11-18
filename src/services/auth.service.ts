import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";

export const authService = {
    async register(email: string, password: string) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new Error("Email already in use");
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await userRepository.create(email, hash);
        return user;
    },

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error("Invalid credentials");
        }

        return user;
    },
};