"use strict";

var validator = require("validator");
var ArticleModel = require("../models/article.model");
var path = require("path");
var fs = require("fs");

var ArticleController = {
  /* FUncionamiento */

  /* Métodos de prueba */
  datos: (req, res) => {
    return res.status(200).send({
      dato: "Este es para el articulo",
      otrodato: "Otro dato xd",
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Un test de Article controller",
    });
  },
  /* Metodos funcionales */

  /* Método para guardar */
  save: (req, res) => {
    var params = req.body;
    /* Validamos datos con la librería validatos */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
      var validateDescription = !validator.isEmpty(params.description);
      var validateMainLabel = !validator.isEmpty(params.mainLabel);
      /* title, content, description y mainLabel son keys que se usan en postman */
    } catch (error) {
      return res.status(500).send({
        message: "Faltan datos por enviar",
        params: params,
      });
    }

    if (
      validateTitle &&
      validateContent &&
      validateDescription &&
      validateMainLabel
    ) {
      var article = new ArticleModel();
      article.title = params.title;
      article.content = params.content;
      article.description = params.description;
      article.mainLabel = params.mainLabel;
      article.image = null;

      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "Error",
            message: "Save failed",
          });
        }
        return res.status(200).send({
          message: "The data was saved successfully",
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "Incorrect data",
      });
    }
  },
  /* Método para extraer los articulos ordenados del más reciente al más antiguo */
  get: (req, res) => {
    var query = ArticleModel.find({});

    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    }
    query.sort("-_id").exec((error, articles) => {
      if (error) {
        return res.status(500).send({
          status: "Error",
          message: "Show error",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "Error",
          message: "There are no items to show",
        });
      }
      return res.status(200).send({
        status: "Sucess",
        articles: articles,
      });
    });
  },
  /* Método para traer un solo articulo */
  getArticle: (req, res) => {
    var articleID = req.params.id;

    if (!articleID || articleID == null) {
      return res.status(404).send({
        status: "Error",
        message: "Item not found",
      });
    }
    ArticleModel.findById(articleID, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "Error",
          message: "The id " + articleID + " does not exist",
        });
      }
      return res.status(200).send({
        status: "success",
        article: article,
      });
    });
  },
  /* Método par actualizar */
  updateArticle: (req, res) => {
    /* Recoger el id del articulo que viene por la ur */
    var articleId = req.params.id;
    /* Recoger los datos que llegan por put */
    var params = req.body;
    /* Validar datos */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
      var validateDescription = !validator.isEmpty(params.description);
      var validateMainLabel = !validator.isEmpty(params.mainLabel);
    } catch (err) {
      return res.status(200).send({
        status: "Error",
        message: "Faltan datos por enviar",
      });
    }

    if (
      validateTitle &&
      validateContent &&
      validateDescription &&
      validateMainLabel
    ) {
      /* Find and update */
      ArticleModel.findOneAndUpdate(
        {
          _id: articleId,
        },
        params,
        {
          new: true,
        } /* Para que al actualizar nos devuelva el json actualizado */,
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(500).send({
              status: "Error",
              message: "Update failed",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "Error",
        message: "Validación incorrecta",
      });
    }
  },
  /* Metodo para eliminar un articulo */
  deleteArticle: (req, res) => {
    /* Recoger el id de la url */
    var articleId = req.params.id;
    /* Find and delete */
    ArticleModel.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(500).send({
          status: "Error",
          message: "Error al borrar",
        });
      }
      return res.status(200).send({
        status: "Success",
        article: articleRemoved,
      });
    });
  },
  /* Método para cargar la imagen */
  uploadFiles: (req, res) => {
    /* Se debe de configurar el modulo connect multiparty en las rutas*/
    /* Recoger el fichero de la petición */
    var fileName = "imagen no cargada";

    if (!req.files) {
      return res.status(404).send({
        status: "Error",
        message: fileName,
      });
    }
    /* Conseguir el nombre y la extensión del archivo */
    var filePath =
      req.files.file0
        .path; /* Para obtener la ruta con el nombre del archivo, file0 es un nombre por defecto que las librerías le ponen a los archivos */
    var fileSplit = filePath.split(
      "\\"
    ); /* Nos ayuda a separar en pedazos el filePath y así solo tener el nombre */
    fileName = fileSplit[3];
    var extensionSplit = fileName.split(".");
    var fileExtension = extensionSplit[1];
    /* Comprobar la extensión */
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "gif"
    ) {
      /* Borrar el archivo, necesitamos la librería de fileSystem (fs)*/
      /* unlink permite eliminar un fichero */
      fs.unlink(filePath, (err) => {
        return res.status(200).send({
          status: "Error",
          message: "Archivo no compatible",
        });
      });
    } else {
      /* Buscar el articulo, asignar el nombre de la imagen y actualizar */
      var articleId = req.params.id;
      ArticleModel.findOneAndUpdate(
        { _id: articleId },
        { image: fileName },
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(300).send({
              status: "Error",
              message: "Error al subir imagen",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: articleUpdated,
          });
        }
      );
    }
  },
  /* Método para obtener la imagen */
  getImage: (req, res) => {
    var file = req.params.image;
    var pathFile = "./upload/img/articles/" + file;
    /* exits es para saber si existe el archivo, pertenece a la libreria fs */
    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          status: "Error",
          message: "No se encontro la imagen",
        });
      }
    });
  },
  /* Método para buscar un articulo */
  search: (req, res) => {
    /* Sacar el string a buscar */
    var searchString = req.params.search;
    /* Find or para hacer varias condiciones */
    /* $or es un operador de mongoose, dentro de los corchetes se mete cun objeto con una condicion, $regex: searchString quiere decir que cuando el titulo contenta el searchString y los options tiene i para decir si esta incluido, es decir si el searchString esta incluido en el title o en el content entonces mostrara los articulos que coincidan con eso. sort es para ordenar, otra forma de ordenar es poniendo doble corchete (array)  y podemos ponemos varias reglas, por fecha y descendiente y con exec nos ejecuta la query*/
    ArticleModel.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "Error",
            message: "Error al buscar",
          });
        }
        if (!articles || articles <= 0) {
          return res.status(500).send({
            status: "Error",
            message: "No se encontraron articulos para mostrar",
          });
        }
        return res.status(200).send({
          status: "Success",
          articles,
        });
      });
  },
  /* Fin del objeto article controlador */
};

module.exports = ArticleController;
