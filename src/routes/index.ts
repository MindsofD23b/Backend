import { Router } from "express";
import { authRouter } from "./auth.routes";
// import { userRouter } from "./user.routes";
// import { serverRouter } from "./server.routes";

export const router = Router();

router.use("/auth", authRouter);
// router.use("/users", userRouter);
// router.use("/servers", serverRouter);
