import bot from "../bot/index.js";
import commands from "../bot/commands/index.js";
import { reportError } from "../utils/index.js";

export default async function notify(req, res) {
  try {
    const secret = req.body.secret;

    if (secret === process.env.NOTIFY_SECRET) {
      await commands.notify(bot);

      return res
        .status(200)
        .send(JSON.stringify({ message: "Notification completed" }));
    }

    return res.status(401).send(
      JSON.stringify({
        message: "The secret key is not provided or incorrect",
      })
    );
  } catch (err) {
    await reportError("FUNCTION_NOTIFY", err);
  }
}
