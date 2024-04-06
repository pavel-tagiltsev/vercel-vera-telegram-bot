const EOL = "\r\n";

export default {
  infoReportMessage: (user) => (
    `${user.name}, отчет филиала "${user.filial}" за сегодня не сформирован. Не забудте отправить данные😉`
  ),
  infoReportInlineKeyboard: (url) => (
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Заполнить отчет",
              url,
            },
          ],
        ],
      },
    }
  ),
  infoDeveloperReport: (informedUsers, uninformedUsers, inactiveUsers) => {
    return [
      "Оповещение получили:",
      createList(informedUsers) + EOL,
      "Оповещение не получили:",
      createList(uninformedUsers) + EOL,
      "Неактивные пользователи",
      createList(inactiveUsers),
    ].join(EOL);

    function createList(users) {
      return users.length !== 0
        ? users.map((user) => `${user.name} - ${user.filial}`).join(EOL)
        : "-----";
    }
  },
}
