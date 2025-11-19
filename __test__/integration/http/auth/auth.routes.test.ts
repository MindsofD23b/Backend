// tests/integration/http/auth/auth.routes.test.ts
import request from "supertest";
import { createApp } from "../../../../src/app";
import { prisma } from "../../../../src/config/db";

const app = createApp();

describe("POST /api/auth/register", () => {
    beforeAll(async () => {
        // Test-Datenbank leeren – ACHTUNG: nur auf Test-DB verwenden!
        await prisma.user.deleteMany({});
    });

    it("erstellt einen neuen User", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.ch", password: "secret" });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            email: "test@test.ch",
        });

        const userInDb = await prisma.user.findUnique({
            where: { email: "test@test.ch" },
        });

        expect(userInDb).not.toBeNull();
    });

    it("verhindert doppelte E-Mail", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.ch", password: "secret" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});
