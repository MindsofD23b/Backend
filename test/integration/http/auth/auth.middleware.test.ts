// tests/integration/http/auth/auth.routes.test.ts
import request from "supertest";
import { createApp } from "../../../../src/app";
import { Logger } from "../../../../src/utils/logger";

const app = createApp();

describe("Auth Middleware Test", () => {
    beforeAll(() => {
        Logger.debugEnabled = false;
    })
    it("Test if auth header is set", async () => {
        const res = await request(app)
            .get('/api/user/me/profile');

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });


    it("Test if auth works with a valid token", async () => {
        // const register = await request(app)
        const login = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "secret" });

        console.log(login.body)

        const token = login.body.token;

        console.log(token)

        const res = await request(app)
            .get('/api/user/me/profile')
            .set('Authorization', `Bearer ${token}`);

        console.log(res.body);

        expect(res.body.user).toMatchObject({
            id: expect.any(String),
            email: "test@test.com",
            status: "active",
            role: "user",
            locale: "en",
            timezone: "UTC",
            passwordHash: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            lastLogin: expect.any(String),
            emailVerifiedAt: null,
        });
    });

    it("Test if auth works with incorrect token", async () => {
        const token = 638;

        const res = await request(app)
            .get('/api/user/me/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
        expect(res.body.errmsg).toBeDefined();
    });


});
