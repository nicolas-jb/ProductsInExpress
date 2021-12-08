const express = require("express");
const { Router } = express;
const routerApi = new Router();
const compression = require("compression");
const { getRandoms, getInfo } = require("../controller/controllersApi.js");

routerApi.get("/randoms", (req, res) => {
  getRandoms(req, res);
});

routerApi.get("/info", (req, res) => {
  getInfo(req, res);
});

routerApi.get("/infoZip", compression(), (req, res) => {
  getInfo(req, res);
});

module.exports = { routerApi };
