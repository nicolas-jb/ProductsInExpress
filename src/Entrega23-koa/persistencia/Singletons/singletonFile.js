import productoDAOFile from "../productoDAOFile.js";

const rutaArchivoProductos = "./productos.txt";

export default class SingletonFile {
  static instancia;

  constructor() {
    if (!SingletonFile.instancia) {
      this.dao = new productoDAOFile(rutaArchivoProductos);
      SingletonFile.instancia = this;
    }
  }
  getDao() {
    return this.dao;
  }
}
