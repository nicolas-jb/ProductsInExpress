const express = require("express");
const { Router } = express;
const routerFork = new Router();
const { fork } = require("child_process");

const randoms = fork("randomsNumbers.js");

routerFork.get("/", (req, res) => {
  const cantidad = Number(req.query.cant) || 100e6;
  randoms.on("message", (resultado) => {
    res.end(JSON.stringify(resultado));
  });
  randoms.send(cantidad);
});

module.exports = { routerFork };
