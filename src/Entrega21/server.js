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
