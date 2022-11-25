import bot from "../telegram/bot.js";
import dotenv from "dotenv";

dotenv.config();

bot.telegram.setWebhook(process.env.WEBHOOK_DOMAIN);

export default function webhook(req, res) {
  bot.handleUpdate(req.body, res);
}
