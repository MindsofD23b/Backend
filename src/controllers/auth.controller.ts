import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { env } from "../config/env";
import { Logger } from "../utils/logger";
import { signAccessToken } from "../core/security/jwt";

export const registerController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({ id: user.id, email: user.email });
        Logger.success(`${user.id} created a account`);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            Logger.error(`${err.message}`);
        } else {
            res.status(400).json({ error: "Unknown error", err });
        }
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        const token = signAccessToken({ sub: user.id, email: user.email, role: user.role })
        res.json({ id: user.id, email: user.email, token: token });
        Logger.success(`${user.id} logged in `);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            Logger.error(`${err.message} `);
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
};

export const getUserByEmailController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const email = req.body.email;
        const user = await authService.getUserByEmail(email);
        res.json({ user });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            Logger.error(`${err.message} `)
        } else {
            res.status(400).json({ error: "Unknown error", err });
        }
    }
}

export const verifyEmailController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const token = req.query.token;

        const user = await authService.verifyEmail(token as string);

        Logger.success(`${user.id} has verified a email`);

        res.redirect(env.appBaseUrl)
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            Logger.error(`${err.message} `)
        } else {
            res.status(400).json({ error: "Unknown error", err });
        }
    }
}
