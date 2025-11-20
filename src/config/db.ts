import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Adapter mit deiner DATABASE_URL
const adapter = new PrismaPg({
    connectionString: env.databaseUrl,
});

// Prisma Client mit Adapter
export const prisma = new PrismaClient({ adapter });