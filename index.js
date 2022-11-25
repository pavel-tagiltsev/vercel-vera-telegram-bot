import express from "express";
import dotenv from "dotenv";
import bot from "./telegram/bot.js";
import hooks from "./telegram/hooks/index.js";
import routes from "./routes/index.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN }));

routes(app, __dirname);
hooks.notify(app);

app.listen(PORT, (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});
