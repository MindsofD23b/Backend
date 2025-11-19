import { Router } from "express";
import { 
    getUserByEmailController, 
    loginController, 
    registerController,
    meController
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/user_by_email", getUserByEmailController);

authRouter.get("/me", authMiddleware, meController);