import express from "express";
const { Router } = express;
const routerApi = new Router();
import compression from "compression";
import { getRandoms, getInfo } from "../controller/controllersApi.js";

routerApi.get("/randoms", (req, res) => {
  getRandoms(req, res);
});

routerApi.get("/info", (req, res) => {
  getInfo(req, res);
});

routerApi.get("/infoZip", compression(), (req, res) => {
  getInfo(req, res);
});

export default routerApi;
