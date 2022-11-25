import bot from "../telegram/bot.js";

bot.telegram.setWebhook(process.env.VERCEL_URL);

export default function webhook(req, res) {
  bot.handleUpdate(req.body, res);
}
