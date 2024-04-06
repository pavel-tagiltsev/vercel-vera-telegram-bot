import {GoogleSpreadsheet} from "google-spreadsheet";

export default class GoogleSheetsService extends GoogleSpreadsheet {
  constructor(spreadsheetId, auth, adapter) {
    super(spreadsheetId, auth);
    this.adapter = adapter;
  }

  async init() {
    await this.loadInfo();
    this.sheet = this.sheetsByIndex[0];
  }

  async getAll() {
    return await this._getObjs();
  }

  async getById(id) {
    const objs = await this._getObjs();
    return objs.find((obj) => id === obj.id);
  }

  async updateOne(id, payload) {
    const objs = await this._getObjs();
    const index = objs.findIndex(obj => id === obj.id);

    if (index === -1) {
      return null;
    }

    const rows = await this.sheet.getRows();
    rows[index].assign(this.adapter.toService(payload));
    await rows[index].save();
    return { ...objs[index], ...payload };
  }

  async addOne(obj) {
    const row = await this.sheet.addRow(obj);
    return this.adapter.toProgram(row.toObject());
  }

  async _getObjs() {
    const rows = await this.sheet.getRows();
    const objs = rows.map((row) => row.toObject());

    if (this.adapter) {
      return this.adapter.toProgram(objs);
    }

    return objs;
  }
}