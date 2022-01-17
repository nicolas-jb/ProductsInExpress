import productoDAOMem from "../productoDAOMem.js";

export default class SingletonMem {
  static instancia;

  constructor() {
    if (!SingletonMem.instancia) {
      this.dao = new productoDAOMem();
      SingletonMem.instancia = this;
    }
  }
  getDao() {
    return this.dao;
  }
}
