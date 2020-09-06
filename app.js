'use strict'

var express = require("express");
var bodyParser = require("body-parser");

/* Ejecutar express */
var app = express();
 
/* Cargar rutas */
var Routes = require("./routes/routes");

/* Middlewares */
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/* Cors */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/* Añadimos prefijo de ruta/ cargamos rutas */
app.use("/", Routes);

module.exports = app;