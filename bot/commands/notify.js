import dayjs from "dayjs";
import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

export default async function notify(bot) {
  try {
    const responses = await Promise.all([db.getAllUsers(), db.getAllReports()]);

    const users = responses[0];
    const reports = responses[1];

    let requests = [];

    users.forEach((user) => {
      if (user.chat_id) {
        const isReportDone = reports.find((report) => {
          const isSameDate = dayjs().isSame(report["Дата"], "day");
          const isSameFilial = report["Выберите пансионат"] === user.filial;

          return isSameDate && isSameFilial;
        });

        if (!isReportDone) {
          requests.push(
            bot.telegram.sendMessage(
              user.chat_id,
              `${user.name}, отчет филиала "${user.filial}" за сегодня не сформирован. Не забудте отправить данные😉`,
              {
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
              }
            )
          );
        }
      }
    });

    await Promise.all(requests);
  } catch (err) {
    await reportError("NOTIFY", err);
  }
}
