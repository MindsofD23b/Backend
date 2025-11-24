import express from "express";
import cors from "cors";
import { env } from "./config/env.ts";
import { router } from "./routes/index.ts";

export const createApp = () => {
    const corsOptions = {
        origin: '*'
    };

    const app = express();

    app.use(express.json());
    app.use(cors(corsOptions));

    app.use("/api", router);

    app.get("/health", (req, res) => {
        res.json({ status: "ok", env: env.nodeEnv });
    });

    return app;
};
