import {reportError} from "../../helpers/index.js";

export default async function (err, ctx) {
  ctx.reply("Произошла ошибка😔");
  await reportError("BOT_CATCH", err, false);
}