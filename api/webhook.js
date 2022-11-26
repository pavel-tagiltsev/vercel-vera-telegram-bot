import bot from "../bot/index.js";

export default async function webhook(req, res) {
  await bot.handleUpdate(req.body, res);
}
