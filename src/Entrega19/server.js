/* --------------------------------- Imports -------------------------------- */

const express = require("express");
const handlebars = require("express-handlebars");
const emoji = require("node-emoji");
const { generateFakeProducts } = require("./services/productosFake.js");
const dotenv = require("dotenv");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const parseArgs = require("minimist");
const { argv } = require("process");
const { routerApi } = require("./routes/routerApi.js");
const cluster = require("cluster");
const log4js = require("./services/logger.utils.js");
const { Router } = express;
const router = new Router();

/* ----------------------------------------------------------------------------- */
/* --------------------------------- Arguments --------------------------------- */
const options = {
  alias: {
    p: "port",
    m: "mode",
  },
  default: {
    port: 8080,
    modo: "fork",
  },
};

const { port, mode } = parseArgs(argv, options);

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

app.use("/api/", routerApi);
app.use("/", router);

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");
const loggerWarn = log4js.getLogger("warnFile");

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

app.use((req, res) => {
  loggerWarn.warn(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  loggerConsole.warn(`RUTA: ${req.url} MÉTODO: ${req.method}`);
  res.status(404).json({
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});

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

if (mode == "cluster" && cluster.isMaster) {
  console.log("Master is running");
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker on ${worker.process.pid} died`);
  });
} else {
  router.get("/login", (req, res) => {
    loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    return res.render("login");
  });

  router.get("/auth/facebook", passport.authenticate("facebook"));

  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/faillogin",
    })
  );

  router.get("/faillogin", (req, res) => {
    loggerError.error(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    loggerConsole.error(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    res.render("fail-login");
  });

  router.get("/logout", auth, (req, res) => {
    loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    const userName = req.user.displayName;
    req.logout();
    res.render("logout", { user: userName });
  });

  router.get("/", auth, (req, res) => {
    loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    res.status(200).render("main", {
      data: productosFake,
      userName: req.user.displayName,
      userPhoto: req.user.photos[0].value,
    });
  });

  router.post("/", auth, (req, res) => {
    productosFake.push(generateFakeProducts());
    loggerConsole.info(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    res.status(200).render("main", {
      data: productosFake,
      user: req.session.user,
    });
  });

  router.get("/error", (req, res) => {
    loggerError.error(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    loggerConsole.error(`RUTA: ${req.url} MÉTODO: ${req.method}`);
    res.status(500).send("Error forzado");
  });

  /* -------------------------------------------------------------------------- */
  /* -------------------------------- Server On ------------------------------- */

  app.listen(port, () => {
    console.log(`${emoji.get("computer")} Servidor activo en ${port}`);
  });
}
/* -------------------------------------------------------------------------- */
/* -------------------------------- Export ------------------------------- */

module.exports = { auth };
