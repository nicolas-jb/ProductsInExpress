const productos = require("../Entrega7/products.js");
const mensajes = require("../Entrega7/mensajes.js");
const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
const fetch = require("node-fetch");
const { generateFakeProducts } = require("./productosFake.js");

const { configMariaDB } = require("./configDatabases/configMariaDB.js");
const { configSQLite } = require("./configDatabases/configSQLite.js");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const scriptCreateTables = require("./scriptCreateTables.js");
const MongoStore = require("connect-mongo");

scriptCreateTables.tablesCreation();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;
const MAXAGE = 60000;

const contenedorProductos = new productos.Contenedor(
  configMariaDB,
  "productos"
);
const contenedorMensajes = new mensajes.Contenedor(configSQLite, "mensajes");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const session = require("express-session")({
  store: MongoStore.create({
    mongoUrl: process.env.MONGOURI,
    advancedOptions,
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: null,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

function auth(req, res, next) {
  if (req.session?.user === undefined || req.session?.user === null) {
    return res.render("login_alert");
  }
  req.session.cookie.maxAge += MAXAGE;
  return next();
}

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

app.get("/login", (req, res) => {
  if (req.query.user !== undefined || req.query.user != null) {
    req.session.user = req.query.user;
    return res.redirect("/");
  } else {
    return res.render("login");
  }
});

app.get("/logout", auth, (req, res) => {
  const user = req.session.user;
  req.session.destroy((err) => {
    if (!err) {
      res.render("logout", { user: user });
    } else {
      res.json({ err });
    }
  });
});

app.get("/", auth, async (req, res) => {
  let savedProducts = await contenedorProductos.getAll();
  if (savedProducts.length > 0) {
    res.render("main", {
      data: savedProducts,
      exists: true,
      real: true,
      user: req.session.user,
    });
  } else {
    res.render("main", {
      data: savedProducts,
      exists: false,
      real: true,
      user: req.session.user,
    });
  }
});

app.get("/api/productos-test", async (req, res) => {
  let savedProducts = generateFakeProducts();
  res.render("test", { productos: savedProducts });
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
