import api from "../../api.js";
import { reportError } from "../utils.js";

export default async function onStart(ctx) {
  try {
    if (!ctx.startPayload) {
      ctx.reply("Для активации бота передайте параметр🧐 /start {параметр}");
      return;
    }

    ctx.reply("Инициализация🕑");

    const user = await api.findUserById(ctx.startPayload);

    if (user === "ERROR") {
      ctx.reply("Произошла ошибка😔");
      return;
    }

    if (user) {
      await api.updateUser({
        id: String(user.id),
        chat_id: String(ctx.message.chat.id),
      });

      ctx.reply(`${user.name}, вы подписались на уведомления😎`);

      return;
    }

    ctx.reply("Нет пользователя с данным параметром🤷");
  } catch (err) {
    return reportError("ON_START", err);
  }
}
