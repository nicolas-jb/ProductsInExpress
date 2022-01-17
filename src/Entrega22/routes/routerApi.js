import express from "express";
const { Router } = express;
const routerApi = new Router();
import compression from "compression";
import * as ControllerApi from "../controller/controllersApi.js";
//import log4js from "../services/logger.utils.js";
//const loggerConsole = log4js.getLogger();
//import { generateFakeProducts } from "../services/productosFake.js";
import {myGraphQL} from "../graphql/myGraphQL.js"

routerApi.use("/", myGraphQL)

routerApi.get("/randoms", ControllerApi.getRandoms);

routerApi.get("/info", ControllerApi.getInfo);

routerApi.get("/infoZip", compression(), ControllerApi.getInfo);

/*routerApi.get("/", async (req, res) => {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(200).json(await ControllerApi.getData());
});

routerApi.post("/", async (req, res) => {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(200).json(await ControllerApi.postData(generateFakeProducts()));
});

routerApi.delete("/", async (req, res) => {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(200).json(await ControllerApi.deleteData());
});

routerApi.put("/", async (req, res) => {
  loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(200).json(await ControllerApi.updateData(generateFakeProducts()));
});*/


export default routerApi;
