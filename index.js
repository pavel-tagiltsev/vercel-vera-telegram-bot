import express from "express";
import dotenv from "dotenv";
import bot from "./telegram/bot.js";
import hooks from "./telegram/hooks/index.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN }));

hooks.notify(app);

app.listen(PORT, (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});
