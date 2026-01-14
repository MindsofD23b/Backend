import { userRepository } from "../repositories/user.repository";
import { userProfileRepository } from "../repositories/userProfile.repository";
import { serverRepository } from "../repositories/server.repository";

const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "phone",
    "companyName",
    "addressLine1",
    "addressLine2",
    "postalCode",
    "city",
    "country",
] as const;
type ProfileUpdate = Partial<Record<(typeof ALLOWED_FIELDS)[number], string>>;

export const userService = {
    async getUserWithProfileById(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const profile = await userProfileRepository.findByUserId(userId);
        const serverCount = await serverRepository.countByUserId(userId);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                locale: user.locale,
                timezone: user.timezone,
                emailVerifiedAt: user.emailVerifiedAt,
            },
            profile,
            stats: {
                serverCount,
            },
        };
    },
    async updateProfile(userId: string, data: ProfileUpdate) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Whitelist & sanitize
        const updateData: ProfileUpdate = {};
        for (const key of ALLOWED_FIELDS) {
            if (data[key] !== undefined) {
                updateData[key] = data[key];
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("No valid fields provided");
        }

        // Upsert profile
        const profile = await userProfileRepository.upsertForUser(
            userId,
            updateData
        );

        return profile;
    },

}