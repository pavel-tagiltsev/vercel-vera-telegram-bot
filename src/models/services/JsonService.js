import fs from "fs/promises";
import path from "path";

export default class JsonService {
  constructor(fileName) {
    this.fileName = fileName;
  }
  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const objs = await this._readFile();
    return objs.find((obj) => id === obj.id);
  }

  async updateOne(id, payload) {
    const objs = await this._readFile();
    const index = objs.findIndex(obj => id === obj.id);

    if (index === -1) {
      return null;
    }

    const updatedObj = { ...objs[index], ...payload };
    objs[index] = updatedObj;
    await this._writeFile(objs);
    return updatedObj;
  }

  async addOne(obj) {
    const objs = await this._readFile();
    objs.push({id: Math.random(), ...obj});
    await this._writeFile(objs);
    return obj;
  }

  async _readFile() {
    const string = await fs.readFile(path.join('src', 'database', this.fileName + '.json'), { encoding: 'utf8' });
    return JSON.parse(string);
  }

  async _writeFile(objs) {
    const string = JSON.stringify(objs, null, 2);
    return await fs.writeFile(path.join('src', 'database', this.fileName + '.json'), string, { encoding: 'utf8' });
  }
}