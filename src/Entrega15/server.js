/* --------------------------------- Imports -------------------------------- */

const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
const { generateFakeProducts } = require("./productosFake.js");
const dotenv = require("dotenv");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const parseArgs = require("minimist");
const { routerFork } = require("./routerFork.js");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

/* -------------------------------------------------------------------------- */
/* --------------------------------- Config --------------------------------- */

dotenv.config({ path: __dirname + "/.env" });

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos"],
      scope: ["email"],
    },
    (accessToken, refreshToken, userProfile, done) => {
      return done(null, userProfile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});

const app = express();
const args = parseArgs(process.argv.slice(2));
const PORT = isNaN(args._[0]) ? 8080 : args._[0];
let mode = isNaN(args._[0]) ? args._[0] || "FORK" : args._[1] || "FORK";
mode = mode.toUpperCase();
const MAXAGE = 10 * 60 * 1000; //10 minutes in ms

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: MAXAGE,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/randoms", auth, routerFork);

/* -------------------------------------------------------------------------- */
/* -------------------------- Middleware de control ------------------------- */

async function auth(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("login_alert");
  }
}

/* -------------------------------------------------------------------------- */
/* ------------------------------- Handlebars ------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* ----------------------------- FakerGenerator ----------------------------- */

function initFakeProducts() {
  const fakeProd = [];
  for (let index = 0; index < 5; index++) {
    fakeProd.push(generateFakeProducts());
  }

  return fakeProd;
}

let productosFake = initFakeProducts();

/* -------------------------------------------------------------------------- */
/* --------------------------------- Routes --------------------------------- */

if (mode == "CLUSTER" && cluster.isMaster){
  console.log('Master is running');
  for (let i = 0; i < numCPUs; i++){
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker on ${worker.process.pid} died`)
  })
}else{
app.get("/login", (req, res) => {
  return res.render("login");
});

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/faillogin",
  })
);

app.get("/faillogin", (req, res) => {
  res.render("fail-login");
});

app.get("/logout", auth, (req, res) => {
  const userName = req.user.displayName;
  req.logout();
  res.render("logout", { user: userName });
});

app.get("/", auth, (req, res) => {
  res.status(200).render("main", {
    data: productosFake,
    userName: req.user.displayName,
    userPhoto: req.user.photos[0].value,
  });
});

app.post("/", auth, (req, res) => {
  productosFake.push(generateFakeProducts());
  res.status(200).render("main", {
    data: productosFake,
    user: req.session.user,
  });
});

app.get("/info", auth, (req, res) => {
  const folder = process.cwd().split("/").pop();
  res.status(200).json({
    "Argumentos de entrada": args._,
    "Plataforma": process.platform,
    "Número de Procesadores": numCPUs,
    "Versión Node": process.version,
    "Memoria total reservada (rss)": process.memoryUsage().rss,
    "Path de ejecución": process.cwd(),
    "Process id": process.pid,
    "Carpeta del proyecto": folder,
  });
});

/* -------------------------------------------------------------------------- */
/* -------------------------------- Server On ------------------------------- */

app.listen(PORT, () => {
  console.log(`${emoji.get("computer")} Servidor activo en ${PORT}`);
});
}
/* -------------------------------------------------------------------------- */
/* -------------------------------- Export ------------------------------- */

module.exports = { auth };