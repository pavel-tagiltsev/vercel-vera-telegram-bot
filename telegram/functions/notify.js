import dayjs from "dayjs";
import bot from "../bot.js";
import api from "../../api.js";
import { reportError } from "../utils.js";

export default async function notify() {
  try {
    const users = await api.getAllUsers();
    if (users === "ERROR") return;

    const reports = await api.getAllReports();
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
                        url: process.env.GOOGLE_FORM_URL,
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
