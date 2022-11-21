import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import notify from "./notify.js";
import { reportError } from "../utils.js";

const TIME_FORMAT = "HH:mm"; // 15:30
const DATE_FORMAT = "DD.MM.YYYY"; // 01.02.2020
const TIMEZONE = "Europe/Moscow"; // UTC+3
const UPDATE_TIMING = 5000; // 5 seconds

dayjs.extend(utc);
dayjs.extend(timezone);

export default function notifyBySchedule(times) {
  try {
    let notifieds = times.map((time) => {
      return { time, date: null };
    });

    setInterval(() => {
      try {
        const now = dayjs().tz(TIMEZONE);

        times.forEach((time) => {
          if (is_today_notified(notifieds, time, now)) {
            return;
          }

          if (now.format(TIME_FORMAT) === time) {
            update_notifieds(notifieds, time, now);
            notify();
          }
        });
      } catch (err) {
        reportError("NOTIFY_BY_SCHEDULE_CYCLE", err);
      }
    }, UPDATE_TIMING);
  } catch (err) {
    reportError("NOTIFY_BY_SCHEDULE", err);
  }
}

function format_date(date) {
  return date.format(DATE_FORMAT);
}

function is_today_notified(notifieds, time, now) {
  return notifieds.find((date) => date.time === time).date === format_date(now);
}

function update_notifieds(notifieds, time, now) {
  const index = notifieds.indexOf(notifieds.find((date) => date.time === time));

  if (~index) {
    notifieds[index].date = format_date(now);
  }
}
