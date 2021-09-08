const knex = require("knex");

class Contenedor {
  constructor(config, tabla) {
    this.db = knex(config);
    this.tabla = tabla;
  }
  async getAll() {
    try {
      const savedMessages = await this.db.from(this.tabla).select();
      const messages = [];
      savedMessages.map((message) => {
        messages.push({
          email: message.email,
          timeM: message.timeM,
          message: message.message,
        });
      });
      return messages;
    } catch (error) {
      return [];
    } 
  }

  async save(message) {
    try {
      await this.db.from(this.tabla).insert(message);
    } catch (e) {
      console.error(e);
      throw new Error();
    } 
  }
}

module.exports = {
  Contenedor,
};

