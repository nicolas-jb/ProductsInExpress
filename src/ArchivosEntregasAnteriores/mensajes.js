const fs = require("fs");

class Contenedor {
  constructor(nombreArchivo) {
    // eslint-disable-next-line no-undef
    this.ruta = __dirname + `/${nombreArchivo}.txt`;
  }
  async getAll() {
    try {
      const savedMessages = await fs.promises.readFile(this.ruta, "utf-8");
      return JSON.parse(savedMessages);
    } catch (error) {
      return [];
    }
  }

  async save(message) {
    try {
      const savedMessages = await this.getAll();
      savedMessages.push(message);

      await fs.promises.writeFile(
        this.ruta,
        JSON.stringify(savedMessages, null, 2)
      );
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }
}



module.exports = {
  Contenedor
};
