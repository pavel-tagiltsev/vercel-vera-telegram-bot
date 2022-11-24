import { Telegraf } from "telegraf";
import commands from "./commands/index.js";

let bot = new Telegraf(process.env.VERA_SERVICE_BOT_KEY);

bot.start(async (ctx) => {
  if ((await commands.onStart(ctx)) === "ERROR") {
    ctx.reply("Произошла ошибка😔");
    return;
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
