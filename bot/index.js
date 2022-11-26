import { Telegraf } from "telegraf";
import commands from "./commands/index.js";
import { reportError } from "../utils/index.js";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await commands.start(ctx);
});

bot.catch(async (err, ctx) => {
  ctx.reply("Произошла ошибка😔");
  await reportError("BOT_CATCH", err);
  bot.stop("An error has occurred");
});

export default bot;
