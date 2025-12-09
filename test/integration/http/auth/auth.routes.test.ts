// tests/integration/http/auth/auth.routes.test.ts
import request from "supertest";
import { createApp } from "../../../../src/app";
import { prisma } from "../../../../src/config/db";
import { signEmailVerificationToken } from "../../../../src/core/security/jwt";
import { env } from "../../../../src/config/env";
import { Logger } from "../../../../src/utils/logger";

const app = createApp();

describe("POST /api/auth/register", () => {
    beforeAll(async () => {
        await prisma.user.deleteMany({});
        Logger.debugEnabled = false;
    });

    it("erstellt einen neuen User", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.com", password: "secret" });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            email: "test@test.com",
        });

        const userInDb = await prisma.user.findUnique({
            where: { email: "test@test.com" },
        });

        expect(userInDb).not.toBeNull();
    });

    it("verhindert doppelte E-Mail", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.com", password: "secret" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it("validiere email", async () => {
        const user = await prisma.user.findUnique({ where: { email: "test@test.com" } });
        expect(user).not.toBeNull();

        const token = signEmailVerificationToken({
            sub: user!.id,
            email: user!.email,
            type: "email_verification"
        });

        const res = await request(app)
            .get("/api/auth/verify-email")
            .query({ token });

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe(env.appBaseUrl);
    });

    it("Error beim validieren", async () => {
        const res = await request(app)
            .get("/api/auth/verify-email")
            .query({ token: "this-is-invalid" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it("Unknown Error beim validieren", async () => {
        const res = await request(app)
            .get("/api/auth/verify-email")
            .query({ token: 453 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("jwt malformed");
    });

    it("User not found beim validieren", async () => {
        const token = signEmailVerificationToken({
            sub: "test2",
            email: "test2@test.com",
            type: "email_verification"
        });

        const res = await request(app)
            .get("/api/auth/verify-email")
            .query({ token });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("user not found");
    });
});
