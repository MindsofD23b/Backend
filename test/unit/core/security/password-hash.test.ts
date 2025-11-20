import { passwordHash } from "../../../../src/core/security/password-hash";

describe("passwordHash utility", () => {
    it("hashed password should not equal the plain password", async () => {
        const password = "mySecretPassword123";
        const hash = await passwordHash.hash(password);

        expect(hash).not.toBe(password);
        expect(typeof hash).toBe("string");
    });

    it("should validate correct password using compare()", async () => {
        const password = "test123456";
        const hash = await passwordHash.hash(password);

        const isValid = await passwordHash.compare(password, hash);

        expect(isValid).toBe(true);
    });

    it("should not validate incorrect password", async () => {
        const correct = "test123456";
        const wrong = "another-password!";
        const hash = await passwordHash.hash(correct);

        const isValid = await passwordHash.compare(wrong, hash);

        expect(isValid).toBe(false);
    });

    it("should generate different hashes for the same password each time", async () => {
        const password = "repeatTest#123";

        const hash1 = await passwordHash.hash(password);
        const hash2 = await passwordHash.hash(password);

        expect(hash1).not.toBe(hash2);
    });
});
