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

        const user = await authService.login("test@test.ch", "correct");
        expect(user.id).toBe("user-1");
        expect(userRepository.update_lastLogin).toHaveBeenCalledTimes(1);
        expect(userRepository.update_lastLogin).toHaveBeenCalledWith(
            "user-1",
            expect.any(Date)
        );
    });
});