const productos = require("../products.js");
const express = require("express");
const handlebars = require("express-handlebars");

const app = express();
const PORT = 8080;
const contenedor = new productos.Contenedor("productos2");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

async function obtenerProductos() {
  return await contenedor.getAll();
}

async function agregarUnProducto(producto) {
  return await contenedor.save(producto);
}

app.get("/agregarProducto", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post("/agregarProducto", (req, res) => {
  async function unProducto() {
    const producto = req.body;
    const id = await agregarUnProducto(producto);
    res.redirect(303, '/vistaProductos');
  }
  unProducto();
})

app.get("/vistaProductos", (req, res) => {
  async function productos() {
    const savedProducts = await obtenerProductos();
    if (savedProducts.length > 0) {
      res.render("main", { data: savedProducts, exists: true });
    } else {
      res.render("main", { data: savedProducts, exists: false });
    }
  }
  productos();
});

app.post("/", (req, res) => {
  async function unProducto() {
    const producto = req.body;
    const id = await agregarUnProducto(producto);
    res.send(`Se agregó un nuevo producto cuyo id es ${id}`);
  }
  unProducto();
});

app.listen(PORT, () => {
  console.log(`Servidor activo en ${PORT}`);
});
