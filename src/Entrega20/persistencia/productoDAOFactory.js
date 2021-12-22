import productoDAOFile from "./productoDAOFile.js";
import productoDAODb from "./productoDAODb.js";
import productoDAOMem from "./productoDAOMem.js";
import dotenv from "dotenv"
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });



const rutaArchivoProductos = "./productos.txt";
const cnxStr = process.env.MONGOURI; 

const opcion = process.argv[2] || "Mem";

let dao;
switch (opcion.toLowerCase()) {   /// FALTA HACER QUE DEVUELVA SINGLETON
  case "mongo":
    dao = new productoDAODb(cnxStr);
    await dao.init();
    break;
  case "file":
    dao = new productoDAOFile(rutaArchivoProductos);
    await dao.init();
    break;
  default:
    dao = new productoDAOMem();
    dao.init();
}

export default class productoDAOFactory {
  static getDao() {
    return dao;
  }
}
