import { createApp } from "./app.ts";
import { env } from "./config/env.ts";

const app = createApp();

app.listen(env.port, () => {
    console.log(`http://localhost:${env.port}`);
});