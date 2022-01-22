import generateRandomsNumbers from "../services/randomsNumbers.js";
import log4js from "../services/logger.utils.js";
const loggerConsole = log4js.getLogger();
import os from "os";
import productoDAOFactory from "../persistencia/productoDAOFactory.js";
import { generateFakeProducts } from "../services/productosFake.js";

const numCPUs = os.cpus().length;

const productoDAO = productoDAOFactory.getDao();
productoDAO.limpiar();

export function getRandoms(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  const cantidad = Number(ctx.query.cant) || 100e6;
  ctx.body = {
    status: "success",
    code: 200,
    message: generateRandomsNumbers(cantidad),
  };
}
export function getInfo(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  const folder = process.cwd().split("/").pop();
  const response = {
    "Argumentos de entrada": process.argv.slice(2),
    Plataforma: process.platform,
    "Número de Procesadores": numCPUs,
    "Versión Node": process.version,
    "Memoria total reservada (rss)": process.memoryUsage().rss,
    "Path de ejecución": process.cwd(),
    "Process id": process.pid,
    "Carpeta del proyecto": folder,
  };

  ctx.body = {
    status: "success",
    code: 200,
    message: response,
  };
}

export async function getData(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  const data = await productoDAO.get();
  ctx.body = {
    status: "success",
    code: 200,
    message: data,
  };
}

export async function postData(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  const producto = generateFakeProducts();
  await productoDAO.add(producto);
  ctx.body = {
    status: "success",
    code: 200,
    message: producto,
  };
}

export async function deleteData(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  let data = await productoDAO.get();
  if (data.length > 0) {
    const producto = data[0]
    await productoDAO.delete(producto.title);
    ctx.body = {
      status: "success",
      code: 200,
      message: producto,
    };
  } else {
    ctx.body = {
      status: "error",
      code: 404,
      message: "No se encontró el producto a eliminar",
    };
  }
}

export async function updateData(ctx) {
  loggerConsole.info(`RUTA: ${ctx.req.url} MÉTODO: ${ctx.req.method}`);
  let data = await productoDAO.get();
  const producto = generateFakeProducts();
  if (data.length > 0) {
    await productoDAO.modify(data[0].title, producto);
    ctx.body = {
      status: "success",
      code: 200,
      message: producto,
    };
  } else {
    ctx.body = {
      status: "error",
      code: 404,
      message: "No se encontró el producto a eliminar",
    };
  }
}
