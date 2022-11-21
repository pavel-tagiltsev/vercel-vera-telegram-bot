import bot from "./bot.js";

export async function reportError(id, err) {
  console.error(id, err);

  try {
    await bot.telegram.sendMessage(
      process.env.DEV_TELEGRAM_CHAT_ID,
      `ERROR - ${id}\r\n${err}`
    );
  } catch (err) {
    console.log(err);
  }

  return "ERROR";
}
