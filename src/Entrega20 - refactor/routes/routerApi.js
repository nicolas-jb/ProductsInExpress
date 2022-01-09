import express from "express";
const { Router } = express;
const routerApi = new Router();
import compression from "compression";
import * as ControllerApi from "../controller/controllersApi.js";
import productoDAOFactory from "../persistencia/productoDAOFactory.js";
import { generateFakeProducts } from "../services/productosFake.js";

const productoDAO = productoDAOFactory.getDao();


routerApi.get("/randoms", (req, res) => {
  ControllerApi.getRandoms(req, res);
});

routerApi.get("/info", (req, res) => {
  ControllerApi.getInfo(req, res);
});

routerApi.get("/infoZip", compression(), (req, res) => {
  ControllerApi.getInfo(req, res);
});

routerApi.get("/logout", (req, res) => {
  ControllerApi.renderLogout(req, res);
});

routerApi.get("/", async (req, res) => {
  const data = await productoDAO.get();
  ControllerApi.renderData(req, res, data)
});

routerApi.post("/", async (req, res) => {
  await productoDAO.add(generateFakeProducts());
  const data = await productoDAO.get();
  ControllerApi.renderData(req, res, data)
});

export default routerApi;
