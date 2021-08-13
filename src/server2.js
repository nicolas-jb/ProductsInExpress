//This file has the implementation of the 4th requirement
const productos = require("../src/products.js");
const express = require("express");
const app = express();
const PORT = 8080;
const { Router } = express;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routerProductos = new Router();
const contenedor = new productos.Contenedor("productos");

async function obtenerProductos() {
  return await contenedor.getAll();
}

async function obtenerUnProducto(id) {
  return await contenedor.getById(id);
}

async function borrarUnProducto(id) {
  return await contenedor.deleteById(id);
}

async function agregarUnProducto(producto) {
  return await contenedor.save(producto);
}

async function modificarUnProducto(id, producto) {
  return await contenedor.modify(id, producto);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

routerProductos.get("/", (req, res) => {
  async function productos() {
    const savedProducts = await obtenerProductos();
    res.send(savedProducts);
  }
  productos();
});

routerProductos.get("/:id", (req, res) => {
  async function unProducto() {
    const savedProduct = await obtenerUnProducto(req.params.id);
    if (savedProduct != null) {
      res.send(savedProduct);
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  }
  unProducto();
});

routerProductos.post("/", (req, res) => {
  async function unProducto() {
    const producto = req.body;
    const id = await agregarUnProducto(producto);
    res.send(`Se agregó un nuevo producto cuyo id es ${id}`);
  }
  unProducto();
});

routerProductos.put("/:id", (req, res) => {
  async function unProducto() {
    const flagModify = await modificarUnProducto(req.params.id, req.body);
    if (flagModify != null) {
      res.send(`Se modificó el producto cuyo id es ${req.params.id}`);
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  }
  unProducto();
});

routerProductos.delete("/:id", (req, res) => {
  async function unProducto() {
    const flagDelete = await borrarUnProducto(req.params.id);
    if (flagDelete != null) {
      res.send(`El producto cuyo id era ${req.params.id} fue borrado`);
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  }
  unProducto();
});

app.use("/api/productos", routerProductos);

app.listen(PORT, () => {
  console.log(`Servidor activo en ${PORT}`);
});
