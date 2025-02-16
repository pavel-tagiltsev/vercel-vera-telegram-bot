import models from "../../../models/index.js";
import views from "../../../views/index.js";
import {reportError} from "../../../helpers/index.js";

const STATUS_MAP = {
  SUCCESS: "fulfilled",
  ERROR: "rejected",
}

const ERROR_MESSAGE_MAP = {
  BLOCKED: "Forbidden: src was blocked by the user",
  CHAT_NOT_FOUND: "Bad Request: chat not found"
}
export default class Notifier {
  static bot;
  static notifyUsers = [];
  static informedUsers = [];
  static uninformedUsers = [];
  static inactiveUsers = [];
  static responses;

  static async _checkResponses() {
    for (let i = 0; i < this.responses.length; i++) {
      await this._byStatus(i);
    }
  }

  static async _byStatus(i){
    const user = this.notifyUsers[i].user;

    if (this.responses[i].status === STATUS_MAP.SUCCESS) {
      this.informedUsers.push(user);
    }

    if (this.responses[i].status === STATUS_MAP.ERROR) {
      await this._byMessage(user);
    }
  }

  static async _byMessage(user) {
    const message = this.responses[i].reason.response.description;

    if (message === ERROR_MESSAGE_MAP.BLOCKED) {
      this.inactiveUsers.push(user);
      await models.users.updateOne(user.id,{
        isActive: false,
      });
      return;
    }

    await reportError("SEND_NOTIFICATION", { message: `${user.name} - ${message}` }, false);
  }

  static async _sendInfo() {
    if (
      this.informedUsers.length ||
      this.uninformedUsers.length ||
      this.inactiveUsers.length
    ) {
      await this.bot.telegram.sendMessage(
        process.env.DEV_CHAT_ID,
        views.infoDeveloperReport(this.informedUsers, this.uninformedUsers, this.inactiveUsers),
      );
    }
  }
}