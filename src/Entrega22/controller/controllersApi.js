import generateRandomsNumbers from "../services/randomsNumbers.js";
import log4js from "../services/logger.utils.js";
const loggerConsole = log4js.getLogger();
import os from "os";
const numCPUs = os.cpus().length;
import productoDAOFactory from "../persistencia/productoDAOFactory.js";


const productoDAO = productoDAOFactory.getDao();
productoDAO.limpiar();

export function getRandoms(req, res) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  const cantidad = Number(req.query.cant) || 100e6;
  res.status(200).json(generateRandomsNumbers(cantidad));
}
export function getInfo(req, res) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  const folder = process.cwd().split("/").pop();

  res.status(200).json({
    "Argumentos de entrada": process.argv.slice(2),
    Plataforma: process.platform,
    "Número de Procesadores": numCPUs,
    "Versión Node": process.version,
    "Memoria total reservada (rss)": process.memoryUsage().rss,
    "Path de ejecución": process.cwd(),
    "Process id": process.pid,
    "Carpeta del proyecto": folder,
  });
}

export async function getData() {
  return await productoDAO.get();
}

export async function postData({ datos }) {
  await productoDAO.add(datos);
  return await datos;
}

export async function updateData({ datos }) {
  let data = await productoDAO.get();
  if (data.length > 0) {
    await productoDAO.modify(data[0].title, datos);
  } else {
    await productoDAO.add(datos);
  }
  return await datos;
}

export async function deleteData() {
  let data = await productoDAO.get();
  if (data.length > 0) {
    await productoDAO.delete(data[0].title);
  }
  return await data[0];
}

