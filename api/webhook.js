import bot from "../telegram/bot.js";

export default function webhook(req, res) {
  bot.handleUpdate(req.body, res);
}
