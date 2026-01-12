import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
    getServersController,
    addServerController,
    stopAllServersController,
    deleteServerController
} from "../controllers/server.controller";

export const serverRouter = Router();

serverRouter.get("/", authMiddleware, getServersController);
serverRouter.post("/", authMiddleware, addServerController);
serverRouter.post("/stop", authMiddleware, stopAllServersController);
serverRouter.delete("/:id", authMiddleware, deleteServerController);