import type { JwtPayload } from "../core/security/jwt";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: string;
    }

    // Alternativ könntest du hier auch JwtPayload direkt nutzen
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
