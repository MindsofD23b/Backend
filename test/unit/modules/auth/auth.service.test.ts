import { authService } from "../../../../src/services/auth.service";
import { userRepository } from "../../../../src/repositories/user.repository";
import bcrypt from "bcryptjs";

jest.mock("../../../../src/repositories/user.repository");
jest.mock("bcryptjs");

describe("authService.login", () => {
    it("wirft fehler bei unbekannter email", async () => {
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
        await expect(
            authService.login("unknown@test.ch", "secret")
        ).rejects.toThrow("Invalid credentials");
    });

    it("wirft fehler bei falschem passwort", async () => {
        (userRepository.findByEmail as jest.Mock).mockResolvedValue({
            id: "user-1",
            email: "test@test.ch",
            passwordHash: "hashed",
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        await expect(
            authService.login("test@test.ch", "wrong")
        ).rejects.toThrow("Invalid credentials");
    });

    it("loggt erfolgreich ein und updated lastLogin", async () => {
        (userRepository.findByEmail as jest.Mock).mockResolvedValue({
            id: "user-1",
            email: "test@test.ch",
            passwordHash: "hashed"
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (userRepository.update_lastLogin as jest.Mock).mockResolvedValue(undefined);

        const result = await authService.login("test@test.ch", "correct");

        // result = { user, token }
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("token");

        expect(result.user.id).toBe("user-1");
        expect(result.user.email).toBe("test@test.ch");
        expect(typeof result.token).toBe("string");

        expect(userRepository.update_lastLogin).toHaveBeenCalledTimes(1);
        expect(userRepository.update_lastLogin).toHaveBeenCalledWith(
            "user-1",
            expect.any(Date)
        );
    });
});

describe("authService.register", () => {
    it("erstellt neuen benutzer mit gehashtem passwort", async () => {
        const email = "test@domain.ch";
        const password = "plain-password";

        (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

        (userRepository.create as jest.Mock).mockResolvedValue({
            id: "user-1",
            email,
            passwordHash: "hashed-password",
        });

        const user = await authService.register(email, password);

        expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(email);

        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(
            email,
            "hashed-password"
        );

        expect(user.id).toBe("user-1");
        expect(user.email).toBe(email);
    });

    it("wirft fehler bei bereits existierender email", async () => {
        const email = "existing@domain.ch";
        const password = "some-password";

        (userRepository.findByEmail as jest.Mock).mockResolvedValue({
            id: "user-1",
            email,
            passwordHash: "already-there",
        });

        await expect(
            authService.register(email, password)
        ).rejects.toThrow("Email already in use");

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(userRepository.create).not.toHaveBeenCalled();
    });
});
