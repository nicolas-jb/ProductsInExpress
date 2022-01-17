import mongoose from "mongoose";
import { asDto } from "./ProductoDTO/productoDTO.js";
import log4js from "../services/logger.utils.js";
const loggerConsole = log4js.getLogger();

const productoSchema = new mongoose.Schema({
  titulo: { type: String },
  precio: { type: Number },
  thumbnail: { type: String },
});

export default class PersonasDaoDb {
  constructor(cnxStr) {
    this.cnxStr = cnxStr;
    this.productos = mongoose.model("Productos", productoSchema);
  }

  async init() {
    await mongoose.connect(this.cnxStr);
    loggerConsole.info("Productos DAO en mongodb -> listo");
  }

  async disconnect() {
    await mongoose.disconnect();
    loggerConsole.info("Productos DAO en mongodb -> cerrado");
  }

  async get() {
    return asDto(await this.productos.find({}));
  }

  async add(producto) {
    return await this.productos.create(producto);
  }

  async delete(title) {
    return await this.productos.deleteOne({ title: title });
  }

  async modify(title, producto) {
    return await this.productos.updateOne({ title: title }, producto);
  }
  async limpiar() {
    return await this.productos.deleteMany({});
  }
}
