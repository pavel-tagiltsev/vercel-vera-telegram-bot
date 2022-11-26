import axios from "axios";
import dayjs from "dayjs";
import { reportError } from "../utils/index.js";

const instance = axios.create({
  baseURL: process.env.DATABASE_URL,
  timeout: 30000,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

let db = {};

db.findUserById = async (id) => {
  try {
    const res = await instance.get(`users/select/id/i/`, {
      params: { query: id },
    });
    return res.data[0];
  } catch (err) {
    return reportError("FIND_USER_BY_ID", err);
  }
};

db.updateUser = async (payload) => {
  try {
    return await instance.post("users/update/", JSON.stringify(payload));
  } catch (err) {
    return reportError("UPDATE_USER", err);
  }
};

db.getAllUsers = async () => {
  try {
    const res = await instance.get("users/select/all/");
    return res.data;
  } catch (err) {
    return reportError("GET_ALL_USERS", err);
  }
};

db.getAllReports = async () => {
  try {
    const res = await instance.get("reports/select/date/after-or-equal/", {
      params: { query: dayjs().format("M/D/YYYY") },
    });
    return res.data;
  } catch (err) {
    return reportError("GET_REPORTS_AFTER_OR_EQUAL_TO_DATE", err);
  }
};

export default db;
