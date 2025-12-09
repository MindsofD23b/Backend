import { Router } from "express";
import { authRouter } from "./auth.routes.ts";

export const router = Router();

router.use("/auth", authRouter);
