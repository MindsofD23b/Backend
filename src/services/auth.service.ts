import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../core/security/jwt";

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
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new Error("Invalid credentials");
        }
        await userRepository.update_lastLogin(user.id, new Date());

        const token = signAccessToken({ 
            sub: user.id, 
            email: user.email , 
            role: user.role 
        });

        return {user, token};
    },

    async getUserByEmail(email: string) {
        const user = await userRepository.findByEmail(email);
        if (!user){
            throw new Error("User not found");
        }
        return user;
    },

    async getUserById(id: string) {
        const user = await userRepository.findById(id);
        if (!user){
            throw new Error("User not found");
        }
        return user;
    }
};