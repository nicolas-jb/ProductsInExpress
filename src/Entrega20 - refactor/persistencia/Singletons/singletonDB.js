import productoDAODb from "../productoDAODb.js";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


const cnxStr = process.env.MONGOURI;


export default class SingletonDB {
  static instancia;

  constructor() {
    if (!SingletonDB.instancia) {
      this.dao = new productoDAODb(cnxStr);
      SingletonDB.instancia = this;
    }
  }
  getDao() {
    return this.dao;
  }
}
