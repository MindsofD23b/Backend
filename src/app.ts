import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { router } from "./routes";

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", router);

    app.get("/health", (req, res) => {
        res.json({ status: "ok", env: env.nodeEnv });
    });

    return app;
};
