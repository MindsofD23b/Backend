import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export const getMyProfileController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const result = await userService.getUserWithProfileById(userId);
        res.json(result);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
};

export const updateMyProfileController = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const profileData = req.body;
        const result = await userService.updateProfile(userId, profileData);
        res.json(result);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
};
