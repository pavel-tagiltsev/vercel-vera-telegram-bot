import bot from "../bot/index.js";
import commands from "../bot/commands/index.js";
import { reportError } from "../utils/index.js";

export default async function notify(req, res) {
  try {
    const token = req.headers.authentication;
    const preNotify = req.body.preNotify;

    if (preNotify) {
      return res.status(200).json({ message: "The function is awake" });
    }

    if (token === process.env.NOTIFY_SECRET) {
      await commands.notify(bot);

      return res.status(200).json({ message: "Notification completed" });
    }

    return res.status(401).json({
      message: "The token is not provided or incorrect",
    });
  } catch (err) {
    await reportError("FUNCTION_NOTIFY", err);
  }
}
