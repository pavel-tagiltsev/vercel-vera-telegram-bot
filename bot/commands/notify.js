import dayjs from "dayjs";
import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

export default async function notify(bot) {
  try {
    const responses = await Promise.all([db.getAllUsers(), db.getAllReports()]);

    const users = responses[0];
    const reports = responses[1];

    let requests = [];
    let informedUsers = [];
    let uninformedUsers = [];

    users.forEach((user) => {
      if (user.chat_id) {
        const isReportDone = reports.find((report) => {
          const isSameDate = dayjs().isSame(report["Дата"], "day");
          const isSameFilial = report["Выберите пансионат"] === user.filial;

          return isSameDate && isSameFilial;
        });

        if (!isReportDone) {
          informedUsers.push(user);

          requests.push(
            bot.telegram.sendMessage(
              user.chat_id,
              createUserMessage(user),
              createInlineKeyboard()
            )
          );
        } else {
          uninformedUsers.push(user);
        }
      }
    });

    await Promise.all(requests);

    if (informedUsers.length !== 0 && uninformedUsers.length !== 0) {
      await bot.telegram.sendMessage(
        process.env.DEV_CHAT_ID,
        createDevMessage(informedUsers, uninformedUsers)
      );
    }
  } catch (err) {
    await reportError("NOTIFY", err);
  }
}

function createUserMessage(user) {
  return `${user.name}, отчет филиала "${user.filial}" за сегодня не сформирован. Не забудте отправить данные😉`;
}

function createInlineKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Заполнить отчет",
            url: process.env.REPORT_URL,
          },
        ],
      ],
    },
  };
}

function createDevMessage(informedUsers, uninformedUsers) {
  const informed =
    informedUsers.length !== 0
      ? informedUsers
          .map((user) => `${user.name} - ${user.filial}`)
          .join("\r\n")
      : "-----";

  const uninformed =
    uninformedUsers.length !== 0
      ? uninformedUsers
          .map((user) => `${user.name} - ${user.filial}`)
          .join("\r\n")
      : "-----";

  return [
    "Отчет",
    "Оповещение получили:",
    informed,
    "Оповещение не получили:",
    uninformed,
  ].join("\r\n");
}
