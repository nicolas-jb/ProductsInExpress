const productos = require("../products.js");
const mensajes = require("../mensajes.js");
const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
const fetch = require("node-fetch");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;
const contenedor = new productos.Contenedor("productos2");
const contenedorMensajes = new mensajes.Contenedor("mensajes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


async function obtenerProductos() {
  return await contenedor.getAll();
}

async function agregarUnProducto(producto) {
  return await contenedor.save(producto);
}

async function obtenerMensajes() {
  return await contenedorMensajes.getAll();
}

async function agregarUnMensaje(mensaje) {
  return await contenedorMensajes.save(mensaje);
}


app.get("/productos", async (req, res) => {
  res.json(await obtenerProductos());
});

app.get("/", async (req, res) => {
  let savedProducts = await fetch(`http://localhost:${PORT}/productos`, {
    method: "GET",
  }).then((res) => res.json());
  if (savedProducts.length > 0) {
    res.render("main", { data: savedProducts, exists: true });
  } else {
    res.render("main", { data: savedProducts, exists: false });
  }
});

httpServer.listen(PORT, () => {
  console.log(`${emoji.get("computer")} Servidor activo en ${PORT}`);
});

io.on("connection", async (socket) => {
  console.log(`${emoji.get("pizza")} ${emoji.get("smile")} Usuario Conectado!`);

  io.sockets.emit("newProducts", await obtenerProductos());

  io.sockets.emit("newMessages", await obtenerMensajes());
  
  
  socket.on("newProduct", async (product) => {
    await agregarUnProducto(product);
    io.sockets.emit("newProducts", await obtenerProductos());
  });

  socket.on("newMessage", async (message) => {
    await agregarUnMensaje(message);
    io.sockets.emit("newMessages", await obtenerMensajes());
  });
  


});
