import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

export default async function start(ctx) {
  try {
    if (!ctx.startPayload) {
      ctx.reply("Для активации бота передайте параметр🧐 /start {параметр}");
      return;
    }

    ctx.reply("Инициализация🕑");

    const user = await db.findUserById(ctx.startPayload);

    if (user) {
      await db.updateUser({
        id: String(user.id),
        chat_id: String(ctx.message.chat.id),
      });

      ctx.reply(`${user.name}, вы подписались на уведомления😎`);

      return;
    }

    ctx.reply("Нет пользователя с данным параметром🤷");
  } catch (err) {
    await reportError("START", err);
  }
}
