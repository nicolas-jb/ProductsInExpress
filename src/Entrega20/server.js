/* --------------------------------- Imports -------------------------------- */

import express from "express"
import handlebars from "express-handlebars"
import emoji from "node-emoji"
import { generateFakeProducts } from "./services/productosFake.js"
import dotenv from "dotenv"
import passport from "passport"
import pf from "passport-facebook"
import session from "express-session"
import parseArgs from "minimist"
import { argv } from "process"
import  routerApi  from "./routes/routerApi.js"
import cluster from "cluster"
import log4js from "./services/logger.utils.js"
import { Router } from "express";
const  router = new Router();
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import productoDAOFactory from "./persistencia/productoDAOFactory.js";

const productoDAO = productoDAOFactory.getDao()
const FacebookStrategy = pf.Strategy;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

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

export async function auth(req, res, next) {
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
  loggerWarn.warn(`RUTA: ${req.url} M??TODO: ${req.method}`);
  loggerConsole.warn(`RUTA: ${req.url} M??TODO: ${req.method}`);
  res.status(404).json({
    descripci??n: `ruta ${req.url} m??todo ${req.method} no implementado`,
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

productoDAO.add(initFakeProducts());

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
    loggerConsole.info(`RUTA: ${req.url} M??TODO: ${req.method}`);
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
    loggerError.error(`RUTA: ${req.url} M??TODO: ${req.method}`);
    loggerConsole.error(`RUTA: ${req.url} M??TODO: ${req.method}`);
    res.render("fail-login");
  });

  router.get("/logout", auth, (req, res) => {
    loggerConsole.info(`RUTA: ${req.url} M??TODO: ${req.method}`);
    const userName = req.user.displayName;
    req.logout();
    res.render("logout", { user: userName });
  });

  router.get("/", auth, async (req, res) => {
    loggerConsole.info(`RUTA: ${req.url} M??TODO: ${req.method}`);
    res.status(200).render("main", {
      data: await productoDAO.get(),
      userName: req.user.displayName,
      userPhoto: req.user.photos[0].value,
    });
  });

  router.post("/", auth, async (req, res) => {
    productoDAO.add(generateFakeProducts());
    loggerConsole.info(`RUTA: ${req.url} M??TODO: ${req.method}`);
    res.status(200).render("main", {
      data: await productoDAO.get(),
      user: req.session.user,
    });
  });

  router.get("/error", (req, res) => {
    loggerError.error(`RUTA: ${req.url} M??TODO: ${req.method}`);
    loggerConsole.error(`RUTA: ${req.url} M??TODO: ${req.method}`);
    res.status(500).send("Error forzado");
  });

  /* -------------------------------------------------------------------------- */
  /* -------------------------------- Server On ------------------------------- */

  app.listen(port, () => {
    console.log(`${emoji.get("computer")} Servidor activo en ${port}`);
  });
}