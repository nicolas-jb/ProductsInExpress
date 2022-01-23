const numCPUs = require("os").cpus.length;

module.exports = {
  info: function (req, res) {
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
  },

  random: function (req, res) {
    const cantidad = Number(req.query.cant) || 100e6;
    res.json(generateRandomsNumbers(cantidad));
  },
};


function generateRandomsNumbers(cant) {
    const myMap = new Map();
    let number;
    let value;
    for (let i = 0; i < cant; i++) {
      number = Math.floor(Math.random() * 1000);
      if (myMap.has(number)) {
        value = myMap.get(number) + 1;
      } else {
        value = 1;
      }
  
      myMap.set(number, value);
    }
  
    const sortedMap = new Map([...myMap.entries()].sort((a, b) => a[0] - b[0]));
  
    return Array.from(sortedMap, ([number, quantity]) => ({ number, quantity }));
  }
  