"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 5050;

/* Desactivamos los métodos antiguos de mongo db y solo usamos los actualizados */
mongoose.set("useFindAndModify", false);

/* Creamos nuestra promesa */
mongoose.Promise = global.Promise;

/* Conectar mongoose a Mongo DB */
mongoose
  .connect("mongodb://localhost:27017/backendBlog", { useNewUrlParser: true })
  .then(() => {
    console.log("Successful connection");

    /* Creamos nuestro servidor */
    app.listen(port, () => {
      console.log("Server running on port " + port);
    });
  })
  .catch((e) => {
    console.log("Failed connection" + e);
  });
