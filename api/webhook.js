import bot from "../bot/index.js";
import commands from "../bot/commands/index.js";

export default function webhook(req, res) {
  if (req.body.notify === process.env.NOTIFY_SECRET) {
    commands.notify();
    return res.send("OK");
  }

  try {
    bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error("HANDLE_UPDATE", err);
  }
}
