/* --------------------------------- Imports -------------------------------- */

import express from "express";
import handlebars from "express-handlebars";
import emoji from "node-emoji";
import dotenv from "dotenv";
import routerApi from "./routes/routerApi.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });


/* -------------------------------------------------------------------------- */
/* --------------------------------- Config --------------------------------- */

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", routerApi);


/* -------------------------------------------------------------------------- */
/* ------------------------------- Handlebars ------------------------------- */

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    // eslint-disable-next-line no-undef
    layoutsDir: __dirname + "/views/layouts",
    // eslint-disable-next-line no-undef
    partialsDir: __dirname + "/views/partials",
  })
);

app.set("view engine", "hbs");
// eslint-disable-next-line no-undef
app.set("views", __dirname + "/views");
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));

app.use((req, res) => {
  res.status(404).json({
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});


/* -------------------------------------------------------------------------- */
/* -------------------------------- Server On ------------------------------- */

app.listen(PORT, () => {
  console.log(`${emoji.get("computer")} Servidor activo en ${PORT}`);
});
