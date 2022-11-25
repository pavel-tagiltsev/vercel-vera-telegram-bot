import { Telegraf } from "telegraf";
import commands from "./commands/index.js";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  if ((await commands.start(ctx)) === "ERROR") {
    ctx.reply("Произошла ошибка😔");
    return;
  }
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
