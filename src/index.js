import { Telegraf } from "telegraf";
import { CronJob } from 'cron';
import controllers from "./controllers/index.js";
import schedulers from "./schedulers/index.js";
import 'dotenv/config';

let bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(controllers.start);
bot.catch(controllers.error);

/*
 * Every day at 19 hours and 30 minutes
 */
CronJob.from({
  cronTime: '30 19 * * *',
  onTick: async () => await schedulers.toFillReportReminder.remind(bot),
  start: true,
  timeZone: 'Europe/Moscow'
});

bot.launch();

export default bot;