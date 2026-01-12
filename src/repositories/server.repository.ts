import { ServerStatus } from "@prisma/client";
import { prisma } from "../config/db";

export const serverRepository = {
    findById(id: string) {
        return prisma.server.findUnique({ where: { id } });
    },

    create(name: string, minecraftVersion: string, userid: string, status: ServerStatus = ServerStatus.CREATING) {
        return prisma.server.create({
            data: {
                name,
                owner: {
                    connect: {
                        id: userid,
                    },
                },
                minecraftVersion,
                status,
            },
        });
    },

    delete(id: string) {
        return prisma.server.delete({ where: { id } });
    },

    findAllForUser(userid: string) {
        return prisma.server.findMany({
            where: {
                ownerId: userid,
            },
        });
    },

    stateUpdate(id: string, newState: ServerStatus) {
        return prisma.server.update({
            where: { id },
            data: {
                status: newState,
            },
        });
    }
};
