import Users from "./items/Users.js";
import Reports from "./items/Reports.js";
import GoogleSheetsService from "./services/GoogleSheetsService.js";
import reportsGoogleSheetsAdapter from "./adapters/reportsGoogleSheetsAdapter.js";
import {JWT} from "google-auth-library";
import 'dotenv/config';

const serviceAccountAuth = new JWT({
  keyFile: "./google-auth.json",
  scopes: [process.env.SPREADSHEET_SCOPE],
});

const usersGoogleSheetsService = new GoogleSheetsService(process.env.USERS_SHEET_ID, serviceAccountAuth);
const reportsGoogleSheetsService = new GoogleSheetsService(process.env.REPORTS_SHEET_ID, serviceAccountAuth, reportsGoogleSheetsAdapter);
await usersGoogleSheetsService.init();
await reportsGoogleSheetsService.init();

const users = new Users(usersGoogleSheetsService);
const reports = new Reports(reportsGoogleSheetsService);
export default { users, reports };