import SingletonFile from "./Singletons/singletonFile.js";
import SingletonMem from "./Singletons/singletonMem.js";
import SingletonDB from "./Singletons/singletonDB.js";

const opcion = process.argv[2] || "Mem";

let dao;
switch (opcion.toLowerCase()) {
  case "mongo":
    dao = new SingletonDB().getDao();
    await dao.init();
    break;
  case "file":
    dao = new SingletonFile().getDao();
    await dao.init();
    break;
  default:
    dao = new SingletonMem().getDao();
    dao.init();
}

export default class productoDAOFactory {
  static getDao() {
    return dao;
  }
}
