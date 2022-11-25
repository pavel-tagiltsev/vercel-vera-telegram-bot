import dayjs from "dayjs";
import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

export default async function notify(bot) {
  try {
    const users = await db.getAllUsers();
    if (users === "ERROR") return;

    const reports = await db.getAllReports();
    if (reports === "ERROR") return;

    for (let i = 0; i < users.length; i++) {
      if (users[i].chat_id) {
        const isReportDone = reports.find((report) => {
          const isSameDate = dayjs().isSame(report["Дата"], "day");
          const isSameFilial = report["Выберите пансионат"] === users[i].filial;

          return isSameDate && isSameFilial;
        });

        if (!isReportDone) {
          try {
            await bot.telegram.sendMessage(
              users[i].chat_id,
              `${users[i].name}, отчет филиала "${users[i].filial}" за сегодня не сформирован. Не забудте отправить данные😉`,
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
            );
          } catch (err) {
            reportError("NOTIFY_SEND_MESSAGE", err);
          }
        }
      }
    }
  } catch (err) {
    reportError("NOTIFY", err);
  }
}
