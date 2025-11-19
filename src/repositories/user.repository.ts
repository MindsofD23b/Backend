import { prisma } from "../config/db";

export const userRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },
    create(email: string, passwordHash: string) {
        return prisma.user.create({
            data: { email, passwordHash },
        });
    },
};
