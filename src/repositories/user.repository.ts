import { prisma } from "../config/db";

export const userRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },
    findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    },
    create(email: string, passwordHash: string) {
        return prisma.user.create({
            data: { email, passwordHash },
        });
    },
    update_lastLogin(userId: string, lastLogin: Date) {
        return prisma.user.update({
            where: { id: userId },
            data: { lastLogin },
        });
    },

    verifyEmail(userId: string) {
        const now = new Date();
        return prisma.user.update({
            where: { id: userId },
            data: {
                status: "active",
                emailVerifiedAt: new Date(),
                updatedAt: now,
            } as { status: string, emailVerifiedAt: Date, updatedAt: Date },
        });
    },
};
