/* --------------------------------- Imports -------------------------------- */

import emoji from "node-emoji";
import dotenv from "dotenv";
import routerApi from "./routes/routerApi.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Koa from "koa";
import koaBody from "koa-body";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });


/* -------------------------------------------------------------------------- */
/* --------------------------------- Config --------------------------------- */

const PORT = process.env.PORT || 8080;
const app = new Koa();

app.use(koaBody());
app.use(routerApi.routes());


/* -------------------------------------------------------------------------- */
/* -------------------------------- Server On ------------------------------- */

app.listen(PORT, () => {
  console.log(`${emoji.get("computer")} Servidor activo en ${PORT}`);
});
