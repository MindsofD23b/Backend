import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const registerController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
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
        const { user, token } = await authService.login(email, password);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
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
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}


export const meController = async (
    req: AuthRequest,
    res: Response,
    _next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await authService.getUserById(req.user.sub);

        res.json({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
};
