import { Router } from "express";
import { getUserByEmailController, loginController, registerController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/user_by_email", getUserByEmailController);
