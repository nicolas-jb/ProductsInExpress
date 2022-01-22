import fs from "fs";
import log4js from "../services/logger.utils.js";
const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

export default class ProductoDAOFile {
  #ready = false;

  constructor(ruta) {
    this.ruta = ruta;
    this.productos = [];
  }

  async init() {
    try {
      await fs.promises.readFile(this.ruta, "utf-8");
      this.#ready = true;
      loggerConsole.info("Productos DAO en archivo -> listo");
    } catch (error) {
      await fs.promises.writeFile(this.ruta, "[]");
      this.#ready = true;
      loggerConsole.info("Productos DAO en archivo -> listo");
    }
  }

  disconnect() {
    loggerConsole.info("Productos DAO en archivo -> cerrado");
  }

  #checkReady = () => {
    loggerError.error("INTERNAL_ERROR: DAO no conectado!");
    if (!this.#ready) throw new Error("INTERNAL_ERROR: dao no conectado!");
  };

  #leerArchivo = async () => {
    this.#checkReady();
    const texto = await fs.promises.readFile(this.ruta, "utf-8");
    this.productos = JSON.parse(texto);
  };

  #escribirArchivo = async () => {
    this.#checkReady();
    const texto = JSON.stringify(this.productos, null, 2);
    await fs.promises.writeFile(this.ruta, texto);
  };

  async get() {
    await this.#leerArchivo();
    return this.productos;
  }

  async add(producto) {
    await this.#leerArchivo();

    if (Array.isArray(producto)) {
      producto.forEach((p) => {
        this.productos.push(p);
      });
    } else {
      this.productos.push(producto);
    }
    await this.#escribirArchivo();
  }

  async delete(title) {
    await this.#leerArchivo();
    this.productos.shift();
    await this.#escribirArchivo();
  }

  async modify(title, producto) {
    await this.#leerArchivo();
    this.productos[0] = producto;
    await this.#escribirArchivo();
  }

  async limpiar() {
    this.productos = [];
    await this.#escribirArchivo();
  }
}
