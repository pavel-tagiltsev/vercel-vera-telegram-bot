import { Telegraf } from "telegraf";
import commands from "./commands/index.js";
import { reportError } from "../utils/index.js";

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(async (ctx) => {
  await commands.start(ctx);
});

bot.catch((err, ctx) => {
  ctx.reply("Произошла ошибка😔");
  reportError("BOT_CATCH", err);
});

export default bot;
