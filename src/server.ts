import { createApp } from "./app";
import { Logger } from "./utils/logger";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
    Logger.info(`http://localhost:${env.port}`)
});