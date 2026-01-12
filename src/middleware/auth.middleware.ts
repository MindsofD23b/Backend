import { Response, NextFunction } from "express";
import { SecureRequest } from "../types/request";
import { verifyAccessToken } from "../core/security/jwt";

export function authMiddleware(
  req: SecureRequest,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token", errmsg: err });
  }
}
