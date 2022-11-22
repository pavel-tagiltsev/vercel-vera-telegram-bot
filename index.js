import express from "express";
import dotenv from "dotenv";
import bot from "./telegram/bot.js";
import notifyBySchedule from "./telegram/functions/notifyBySchedule.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});

setInterval(() => console.log("Running"), 5000);

bot.launch();
notifyBySchedule(process.env.TIME_TO_NOTIFY.split(","));
