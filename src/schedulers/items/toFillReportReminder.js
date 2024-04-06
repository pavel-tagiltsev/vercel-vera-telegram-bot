import Notifier from "../class/Notifier.js";
import models from "../../models/index.js";
import views from "../../views/index.js";
import dayjs from "dayjs";

export default class toFillReportReminder extends Notifier {
  static async remind(bot) {
    this.bot = bot;

    const [users, reports] = await Promise.all([
      models.users.getAll(),
      models.reports.getAll(),
    ]);

    users.forEach((user) => {
      if (!user.isActive) {
        this.inactiveUsers.push(user);
        return;
      }

      if (user.chatId) {
        const isTodayReport = reports.find((report) => {
          const isSameDate = dayjs().isSame(report.date, "day");
          const isSameFilial = report.filial === user.filial;
          return isSameDate && isSameFilial;
        });

        if (!isTodayReport) {
          this.notifyUsers.push({
            user,
            request: this.bot.telegram.sendMessage(
              user.chatId,
              views.infoReportMessage(user),
              views.infoReportInlineKeyboard(process.env.REPORT_URL)
            ),
          });
          return;
        }

        this.uninformedUsers.push(user);
      }
    });

    this.responses = await Promise.allSettled(this.notifyUsers.map((user) => user.request));
    await this._checkResponses();
    await this._sendInfo();
  }
}