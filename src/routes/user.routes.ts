import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
    getMyProfileController,
    updateMyProfileController
} from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/me/profile", authMiddleware, getMyProfileController);
userRouter.put("/me/profile", authMiddleware, updateMyProfileController);