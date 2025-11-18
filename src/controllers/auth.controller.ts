import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        res.json({ id: user.id, email: user.email });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};