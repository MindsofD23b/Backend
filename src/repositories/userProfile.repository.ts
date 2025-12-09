import { prisma } from "../config/db";

export const userProfileRepository = {
    findByUserId(userId: string) {
        return prisma.userProfile.findUnique({
            where: { userId },
        });
    },

    upsertForUser(userId: string, data: {
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        companyName?: string | null;
        addressLine1?: string | null;
        addressLine2?: string | null;
        postalCode?: string | null;
        city?: string | null;
        country?: string | null;
    }) {
        return prisma.userProfile.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
        });
    },
};
