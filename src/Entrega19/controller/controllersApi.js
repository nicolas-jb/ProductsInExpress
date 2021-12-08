const generateRandomsNumbers = require("../services/randomsNumbers.js");
const log4js = require("../services/logger.utils.js");
const loggerConsole = log4js.getLogger();
const numCPUs = require("os").cpus().length;

module.exports = {
  getRandoms: function getRandoms(req, res) {
    loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    const cantidad = Number(req.query.cant) || 100e6;
    res.send(JSON.stringify(generateRandomsNumbers(cantidad)));
  },
  getInfo: function getInfo(req, res) {
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
  },
};
