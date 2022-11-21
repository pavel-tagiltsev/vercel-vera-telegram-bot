import axios from "axios";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { reportError } from "./telegram/utils.js";

dotenv.config();

const instance = axios.create({
  baseURL: process.env.BASE_DATABASE_URL,
  timeout: 30000,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

let api = {};

api.findUserById = async (id) => {
  try {
    const res = await instance.get(`users/select/id/is/`, {
      params: { query: id },
    });
    return res.data[0];
  } catch (err) {
    return reportError("FIND_USER_BY_ID", err);
  }
};

api.updateUser = async (payload) => {
  try {
    return await instance.post("users/update/", JSON.stringify(payload));
  } catch (err) {
    return reportError("UPDATE_USER", err);
  }
};

api.getAllUsers = async () => {
  try {
    const res = await instance.get("users/select/all/");
    return res.data;
  } catch (err) {
    return reportError("GET_ALL_USERS", err);
  }
};

api.getAllReports = async () => {
  try {
    const res = await instance.get("reports/select/date/after-or-equal/", {
      params: { query: dayjs().format("M/D/YYYY") },
    });
    return res.data;
  } catch (err) {
    return reportError("GET_REPORTS_AFTER_OR_EQUAL_TO_DATE", err);
  }
};

export default api;
