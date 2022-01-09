import express from "express";
const { Router } = express;
const routerApi = new Router();
import compression from "compression";
import * as ControllerApi from "../controller/controllersApi.js";
import productoDAOFactory from "../persistencia/productoDAOFactory.js";
import { generateFakeProducts } from "../services/productosFake.js";

const productoDAO = productoDAOFactory.getDao();
productoDAO.limpiar();

routerApi.get("/randoms", (req, res) => {
  ControllerApi.getRandoms(req, res);
});

routerApi.get("/info", (req, res) => {
  ControllerApi.getInfo(req, res);
});

routerApi.get("/infoZip", compression(), (req, res) => {
  ControllerApi.getInfo(req, res);
});

routerApi.get("/", async (req, res) => {
  const data = await productoDAO.get();
  ControllerApi.getData(req, res, data);
});

routerApi.post("/", async (req, res) => {
  await productoDAO.add(generateFakeProducts());
  const data = await productoDAO.get();
  ControllerApi.getData(req, res, data);
});

routerApi.delete("/", async (req, res) => {
  let data = await productoDAO.get();
  if (data.length > 0) {
    await productoDAO.delete(data[0].title);
    data = await productoDAO.get();
  }
  ControllerApi.getData(req, res, data);
});

routerApi.put("/", async (req, res) => {
  let data = await productoDAO.get();
  const producto = generateFakeProducts();
  if (data.length > 0) {
    await productoDAO.modify(data[0].title, producto);
  } else {
    await productoDAO.add(producto);
  }
  data = await productoDAO.get();
  ControllerApi.getData(req, res, data);
});

export default routerApi;
