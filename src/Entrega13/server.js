const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
//const fetch = require("node-fetch");
const { generateFakeProducts } = require("./productosFake.js");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const app = express();
const PORT = 8080;
const MAXAGE = 10 * 60 * 1000; //10 minutes in ms
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

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

function initFakeProducts() {
  const fakeProd = [];
  for (let index = 0; index < 5; index++) {
    fakeProd.push(generateFakeProducts());
  }

  return fakeProd;
}

let productosFake = initFakeProducts();

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
  res.status(200).render("main", {
    data: productosFake,
    user: req.session.user,
  });
});

app.post("/", auth, async (req, res) => {
  productosFake.push(generateFakeProducts())
  res.status(200).render("main", {
    data: productosFake,
    user: req.session.user,
  });
});

app.listen(PORT, () => {
  console.log(`${emoji.get("computer")} Servidor activo en ${PORT}`);
});
