import bot from "../bot/index.js";
import commands from "../bot/commands/index.js";

export default async function webhook(req, res) {
  try {
    if (req.body.notify === process.env.NOTIFY_SECRET) {
      commands.notify(bot);
      return res.send("OK");
    }

    await bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error("WEBHOOK", err);
  }
}
