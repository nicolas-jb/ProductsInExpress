import generateRandomsNumbers from "../services/randomsNumbers.js";
import log4js from "../services/logger.utils.js";
const loggerConsole = log4js.getLogger();
import os from "os";
const numCPUs = os.cpus().length;


export function getRandoms(req, res) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  const cantidad = Number(req.query.cant) || 100e6;
  res.send(JSON.stringify(generateRandomsNumbers(cantidad)));
}
export function getInfo(req, res) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  const folder = process.cwd().split("/").pop();

  res.status(200).send(
    JSON.stringify({
      "Argumentos de entrada": process.argv.slice(2),
      Plataforma: process.platform,
      "Número de Procesadores": numCPUs,
      "Versión Node": process.version,
      "Memoria total reservada (rss)": process.memoryUsage().rss,
      "Path de ejecución": process.cwd(),
      "Process id": process.pid,
      "Carpeta del proyecto": folder,
    })
  );
}

export function renderLogout(req, res) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.render("logout");
}

export function renderData(req, res, data) {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(200).render("main", {
    data: data,
    exists: data.length > 0,
  });
}
