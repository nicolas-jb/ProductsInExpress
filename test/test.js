//It is a piece of code to test showing in console, but they are not strictly test, please do not hate me! =)

const productos = require("../src/products.js");

const contenedor = new productos.Contenedor("productos");
const productoEscuadra = new productos.Producto(
  "Escuadra",
  123.45,
  "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
);
const productoCalculadora = new productos.Producto(
  "Calculadora",
  234.56,
  "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
);

async function pruebaGetAll() {
  const productos1 = await contenedor.getAll();
  console.log(productos1);
}

async function pruebaSave(producto) {
  console.log(await contenedor.save(producto));
}

async function pruebaGetById(number) {
  const producto1 = await contenedor.getById(number);
  console.log(producto1);
}

async function pruebaDeleteAll() {
  await contenedor.deleteAll();
}

async function pruebaDeleteById(number) {
  await contenedor.deleteById(number);
}

async function pruebaGetByPosition(number) {
  const producto1 = await contenedor.getByPosition(number);
  console.log(producto1);
}

async function pruebaModify(number, producto) {
  const producto1 = await contenedor.modify(number, producto);
}

async function test() {
  await pruebaDeleteAll();
  await pruebaGetAll();
  await pruebaSave(productoCalculadora);
  await pruebaSave(productoEscuadra);
  await pruebaSave(productoCalculadora);
  await pruebaGetAll();
  await pruebaGetById(2);
  await pruebaGetById(10); // testeo un id que no está
  await pruebaDeleteAll();
  await pruebaGetAll();
  await pruebaSave(productoEscuadra);
  await pruebaSave(productoCalculadora);
  await pruebaSave(productoCalculadora);
  await pruebaGetAll();
  await pruebaDeleteById(6);
  await pruebaGetAll();
  await pruebaSave(productoCalculadora);
  await pruebaSave(productoEscuadra);
  await pruebaGetAll();
  await pruebaGetByPosition(2);
  await pruebaGetByPosition(4);
  await pruebaModify(7, productoEscuadra)
  await pruebaGetAll();
  await pruebaSave(productoCalculadora);
}

test();
