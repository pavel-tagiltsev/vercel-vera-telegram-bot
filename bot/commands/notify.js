import dayjs from "dayjs";
import db from "../../db/index.js";
import { reportError } from "../../utils/index.js";

const MESSAGE_BOT_BLOCKED = "Forbidden: bot was blocked by the user";
const BLOCKED_CHAT_ID = "Bot blocked";

export default async function notify(bot) {
  try {
    const collections = await Promise.all([
      db.getAllUsers(),
      db.getAllReports(),
    ]);

    const users = collections[0];
    const reports = collections[1];

    let usersToNotify = [];

    let infoReport = {
      informedUsers: [],
      uninformedUsers: [],
      blockedUsers: [],
    };

    users.forEach((user) => {
      if (user.chat_id === BLOCKED_CHAT_ID) {
        infoReport.blockedUsers.push(user);
        return;
      }

      if (user.chat_id) {
        const isReportDone = reports.find((report) => {
          const isSameDate = dayjs().isSame(report["Дата"], "day");
          const isSameFilial = report["Выберите пансионат"] === user.filial;

          return isSameDate && isSameFilial;
        });

        if (!isReportDone) {
          usersToNotify.push({
            user,
            request: bot.telegram.sendMessage(
              user.chat_id,
              createUserMessage(user),
              createInlineKeyboard()
            ),
          });

          return;
        }

        infoReport.uninformedUsers.push(user);
      }
    });

    const results = await Promise.allSettled(
      usersToNotify.map((item) => item.request)
    );

    await checkResults(results, usersToNotify, infoReport);
    await sendInfoReport(bot, infoReport);
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

async function checkResults(results, usersToNotify, infoReport) {
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === "fulfilled") {
      infoReport.informedUsers.push(usersToNotify[i].user);
    }

    if (results[i].status === "rejected") {
      const message = results[i].reason.response.description;

      if (message === MESSAGE_BOT_BLOCKED) {
        infoReport.blockedUsers.push(usersToNotify[i].user);

        await db.updateUser({
          id: usersToNotify[i].user.id,
          chat_id: BLOCKED_CHAT_ID,
        });

        return;
      }

      await reportError("SEND_NOTIFICATION", { message }, false);
    }
  }
}

async function sendInfoReport(bot, infoReport) {
  const isInformedUsers = infoReport.informedUsers.length !== 0;
  const isUninformedUsers = infoReport.uninformedUsers.length !== 0;
  const isBlockedUsers = infoReport.blockedUsers.length !== 0;

  if (isInformedUsers || isUninformedUsers || isBlockedUsers) {
    await bot.telegram.sendMessage(
      process.env.DEV_CHAT_ID,
      createInfoMessage(infoReport)
    );
  }

  function createInfoMessage(infoReport) {
    function getList(users) {
      return users.length !== 0
        ? users.map((user) => `${user.name} - ${user.filial}`).join("\r\n")
        : "-----";
    }

    const informedList = getList(infoReport.informedUsers);
    const uninformedList = getList(infoReport.uninformedUsers);
    const blockedList = getList(infoReport.blockedUsers);

    return [
      "Оповещение получили:",
      informedList + "\r\n",
      "Оповещение не получили:",
      uninformedList + "\r\n",
      "Бот заблокирован",
      blockedList,
    ].join("\r\n");
  }
}
