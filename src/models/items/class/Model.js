export default class Model {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async getById(id) {
    return await this.repository.getById(id);
  }

  async updateOne(id, payload) {
    return await this.repository.updateOne(id, payload);
  }

  async addOne(obj) {
    return await this.repository.addOne(obj);
  }
}