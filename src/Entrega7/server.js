const productos = require("../Entrega7/products.js");
const mensajes = require("../Entrega7/mensajes.js");
const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
const fetch = require("node-fetch");

const {configMariaDB} = require('./configDatabases/configMariaDB.js')
const {configSQLite} = require('./configDatabases/configSQLite.js')

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const scriptCreateTables = require('./scriptCreateTables.js')
scriptCreateTables.tablesCreation()

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;
const contenedorProductos = new productos.Contenedor(configMariaDB, "productos");
const contenedorMensajes = new mensajes.Contenedor(configSQLite, "mensajes");

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



app.get("/productos", async (req, res) => {
  res.json(await contenedorProductos.getAll());
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

  io.sockets.emit("newProducts", await contenedorProductos.getAll());

  io.sockets.emit("newMessages", await contenedorMensajes.getAll());
  
  
  socket.on("newProduct", async (product) => {
    await contenedorProductos.save(product);
    io.sockets.emit("newProducts", await contenedorProductos.getAll());
  });

  socket.on("newMessage", async (message) => {
    await contenedorMensajes.save(message);
    io.sockets.emit("newMessages", await contenedorMensajes.getAll());
  });
  


});
