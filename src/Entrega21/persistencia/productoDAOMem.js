import log4js from "../services/logger.utils.js"
const loggerConsole = log4js.getLogger();

export default class ProductoDAOMem {
  constructor() {
    this.productos = [];
  }

  init() {
    loggerConsole.info("Productos DAO en memoria -> listo");
  }

  disconnect() {
    loggerConsole.info("Productos DAO en memoria -> cerrado");
  }

  add(producto) {
    if (Array.isArray(producto)){
        producto.forEach( p => {
            this.productos.push(p);
        })

    }else{
        this.productos.push(producto);
    }
    
  }

  get(){
    return this.productos
  }

}
