import models from "../../models/index.js";

export default async function start(ctx) {
  if (!ctx.startPayload) {
    ctx.reply("Для активации бота передайте параметр🧐 /start {параметр}");
    return;
  }

  ctx.reply("Инициализация🕑");

  const user = await models.users.getById(ctx.startPayload);

  if (user) {
    await models.users.updateOne(user.id, {
      chatId: String(ctx.message.chat.id),
    });

    ctx.reply(`${user.name}, вы подписались на уведомления😎`);

    return;
  }

  ctx.reply("Нет пользователя с данным параметром🤷");
}
