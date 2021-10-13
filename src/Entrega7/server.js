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
const { appendFileSync } = require("fs");

scriptCreateTables.tablesCreation();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

const MAXAGE = 10 * 60 * 1000; //10 minutes in ms

const contenedorProductos = new productos.Contenedor(
  configMariaDB,
  "productos"
);
const contenedorMensajes = new mensajes.Contenedor(configSQLite, "mensajes");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

let activeConnection = false;
let socket_session;

const session = require("express-session")({
  store: MongoStore.create({
    mongoUrl: process.env.MONGOURI,
    advancedOptions,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: MAXAGE,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session);

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(session));

async function auth(req, res, next) {
  if (req.session?.user === undefined || req.session?.user === null) {
    await res.render("login_alert");
  } else {
    next();
  }
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

app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

app.set("view engine", "hbs");
// eslint-disable-next-line no-undef
app.set("views", __dirname + "/views");
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));

app.get("/login", async (req, res) => {
  if (req.query.user !== undefined || req.query.user != null) {
    req.session.user = req.query.user;
    activeConnection = false;

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
    res.status(200).render("main", {
      data: savedProducts,
      exists: true,
      real: true,
      user: req.session.user,
    });
  } else {
    res.status(200).render("main", {
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
  /*
  In the exercise, it was requested to handle sessions (express-session), without 
  taking into account that  socket.io  was  already being used. This is one way I 
  came up  with to  get around the session  timeout problem.  Not the best way, I 
  would prefer to use jwt but this is out of scope
  */
  if (!activeConnection) {
    console.log(
      `${emoji.get("pizza")} ${emoji.get("smile")} Usuario Conectado!`
    );
    socket_session = socket.request.session;
    activeConnection = true;
  }

  io.sockets.emit("newProducts", await contenedorProductos.getAll());

  io.sockets.emit("newMessages", await contenedorMensajes.getAll());

  socket.on("newProduct", async (product) => {
    if (socket_session.cookie.expires - Date.now() >= 0) {
      socket_session.cookie.expires = new Date(Date.now() + MAXAGE);
      await contenedorProductos.save(product);
      io.sockets.emit("newProducts", await contenedorProductos.getAll());
    } else {
      await fetch(`http://localhost:${PORT}/`);
    }
  });

  socket.on("newMessage", async (message) => {
    if (socket_session.cookie.expires - Date.now() >= 0) {
      socket_session.cookie.expires = new Date(Date.now() + MAXAGE);
      await contenedorMensajes.save(message);
      io.sockets.emit("newMessages", await contenedorMensajes.getAll());
    } else {
      io.sockets.emit("newMessages", false);
      await fetch(`http://localhost:${PORT}/`);
    }
  });
});
