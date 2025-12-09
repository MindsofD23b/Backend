import { userRepository } from "../repositories/user.repository.ts";
import { userProfileRepository } from "../repositories/userProfile.repository.ts";


export const userService = {
    async getUserWithProfileById(userId: string) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }
        const profile = await userProfileRepository.findByUserId(userId);
        return {
            user,
            profile
        };
    },
    async updateProfile(userId: string, data: {
        firstname?: string;
        lastname?: string;
        phone?: string;
        companyName?: string;
        addressLine1?: string;
        addressLine2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    }) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const profile = await userProfileRepository.upsertForUser(userId, data);

        return profile;
    },

}