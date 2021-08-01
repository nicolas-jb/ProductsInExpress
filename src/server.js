const productos = require("../src/products.js");
const express = require("express");
const app = express();
const PORT = 8080;

const contenedor = new productos.Contenedor("productos");

async function obtenerProductos() {
  return await contenedor.getAll();
}

app.get("/", (req, res) => {
  res.send(
    `<h1 style = "color: blue"> Bienvenido a este pequeño ejemplo de Express </h1><h2> Por favor accedé a /productos para ver el total de productos del catálogo </h2><h2> Por favor accedé a /productoRandom para ver un producto al azar del catálogo </h2>`
  );
});

app.get("/productos", (req, res) => {
  async function productos() {
    const savedProducts = await obtenerProductos();
    res.send(savedProducts);
  }
  productos();
});

app.get("/productoRandom", (req, res) => {
  async function productoRandom() {
    const savedProducts = await obtenerProductos();
    let num = Math.floor(Math.random() * savedProducts.length);
    const prod = await contenedor.getByPosition(num);
    res.send(prod);
  }
  productoRandom();
});

app.listen(PORT, () => {
  console.log(`Servidor activo en ${PORT}`);
});
