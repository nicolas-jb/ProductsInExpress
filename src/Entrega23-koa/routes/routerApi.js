import Router  from "koa-router"
import * as ControllerApi from "../controller/controllersApi.js";


const routerApi = new Router({
  prefix: '/api'
})

routerApi.get("/randoms", (ctx, next) => {
  ControllerApi.getRandoms(ctx);
  next();
});

routerApi.get("/info", (ctx, next) => {
  ControllerApi.getInfo(ctx);
  next();
});

routerApi.get("/", async (ctx, next) => {
  await ControllerApi.getData(ctx);
  next();
});

routerApi.post("/", async (ctx, next) => {
  await ControllerApi.postData(ctx);
  next();
});

routerApi.delete("/", async (ctx, next) => {
  await ControllerApi.deleteData(ctx);
  next();
});

routerApi.put("/", async (ctx, next) => {
  await ControllerApi.updateData(ctx);
  next();
});

export default routerApi;
