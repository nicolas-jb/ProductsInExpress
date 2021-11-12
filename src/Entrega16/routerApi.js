const express = require("express");
const { Router } = express;
const routerApi = new Router();
const generateRandomsNumbers = require("./randomsNumbers.js");
const compression = require("compression");
const numCPUs = require("os").cpus().length;
const log4js = require("./logger.utils.js");

const loggerConsole = log4js.getLogger();

routerApi.get("/randoms", (req, res) => {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  const cantidad = Number(req.query.cant) || 100e6;
  res.send(JSON.stringify(generateRandomsNumbers(cantidad)));
});

routerApi.get("/info", (req, res) => {
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
});

routerApi.get("/infoZip", compression(), (req, res) => {
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
});

module.exports = { routerApi };
