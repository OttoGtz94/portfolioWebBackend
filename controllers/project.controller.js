"use strict";

var validator = require("validator");
var ProjectModel = require("../models/project.model");
var path = require("path");
var fs = require("fs");

var ProjectController = {
  /* FUncionamiento */

  /* Métodos de prueba */
  datos: (req, res) => {
    return res.status(200).send({
      dato: "Este es para el project",
      otrodato: "Otro dato xd",
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Un test de Project controller",
    });
  },
  /* Metodos funcionales */

  /* Método para guardar */
  save: (req, res) => {
    var params = req.body;
    /* Validamos datos con la librería validatos */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateDescription = !validator.isEmpty(params.description);
      var validateLink = !validator.isEmpty(params.linkGitHub);
      var validateBuilWith = !validator.isEmpty(params.builtWith);
    } catch (error) {
      return res.status(500).send({
        message: "Faltan datos por enviar",
        params: params,
      });
    }

    if (
      validateTitle &&
      validateDescription &&
      validateLink &&
      validateBuilWith
    ) {
      var project = new ProjectModel();
      project.title = params.title;
      project.description = params.description;
      project.linkGitHub = params.linkGitHub;
      project.builtWith = params.builtWith;
      project.image = null;

      project.save((err, projectStored) => {
        if (err || !projectStored) {
          return res.status(404).send({
            status: "Error",
            message: "Save failed",
          });
        }
        return res.status(200).send({
          message: "The data was saved successfully",
          project: projectStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "Incorrect data",
      });
    }
  },
  /* Método para extraer los proyectos ordenados del más reciente al más antiguo */
  get: (req, res) => {
    var query = ProjectModel.find({});

    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(2);
    }
    query.sort("-_id").exec((error, projects) => {
      if (error) {
        return res.status(500).send({
          status: "Error",
          message: "Show error",
        });
      }
      if (!projects) {
        return res.status(404).send({
          status: "Error",
          message: "There are no items to show",
        });
      }
      return res.status(200).send({
        status: "Sucess",
        projects: projects,
      });
    });
  },
  /* Método para traer un solo articulo */
  getProject: (req, res) => {
    var projectID = req.params.id;

    if (!projectID || projectID == null) {
      return res.status(404).send({
        status: "Error",
        message: "Item not found",
      });
    }
    ProjectModel.findById(projectID, (err, project) => {
      if (err || !project) {
        return res.status(404).send({
          status: "Error",
          message: "The id " + projectID + " does not exist",
        });
      }
      return res.status(200).send({
        status: "success",
        article: project,
      });
    });
  },
  /* Método par actualizar */
  updateProject: (req, res) => {
    /* Recoger el id del articulo que viene por la ur */
    var projectId = req.params.id;
    /* Recoger los datos que llegan por put */
    var params = req.body;
    /* Validar datos */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateDescription = !validator.isEmpty(params.description);
      var validateLink = !validator.isEmpty(params.linkGitHub);
      var validateBuilWith = !validator.isEmpty(params.builtWith);
    } catch (error) {
      return res.status(500).send({
        message: "Faltan datos por enviar",
        params: params,
      });
    }

    if (
      validateTitle &&
      validateDescription &&
      validateLink &&
      validateBuilWith
    ) {
      /* Find and update */
      ProjectModel.findOneAndUpdate(
        {
          _id: projectId,
        },
        params,
        {
          new: true,
        } /* Para que al actualizar nos devuelva el json actualizado */,
        (err, projectUpdated) => {
          if (err || !projectUpdated) {
            return res.status(500).send({
              status: "Error",
              message: "Update failed",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: projectUpdated,
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
  deleteProject: (req, res) => {
    /* Recoger el id de la url */
    var projectId = req.params.id;
    /* Find and delete */
    ProjectModel.findOneAndDelete({ _id: projectId }, (err, projectRemoved) => {
      if (err || !projectRemoved) {
        return res.status(500).send({
          status: "Error",
          message: "Error al borrar",
        });
      }
      return res.status(200).send({
        status: "Success",
        article: projectRemoved,
      });
    });
  },
  /* Método para cargar la imagen */
  uploadFiles: (req, res) => {
    var fileName = "imagen no cargada";

    if (!req.files) {
      return res.status(404).send({
        status: "Error",
        message: fileName,
      });
    }

    var filePath = req.files.file0.path;
    var fileSplit = filePath.split("\\");
    fileName = fileSplit[3];
    var extensionSplit = fileName.split(".");
    var fileExtension = extensionSplit[1];

    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg"
    ) {
      fs.unlink(filePath, (err) => {
        return res.status(200).send({
          status: "Error",
          message: "Archivo no compatible",
          extension: fileExtension,
        });
      });
    } else {
      var projectId = req.params.id;
      ProjectModel.findOneAndUpdate(
        { _id: projectId },
        { image: fileName },
        { new: true },
        (err, projectUpdated) => {
          if (err || !projectUpdated) {
            return res.status(300).send({
              status: "Error",
              message: "Error al subir imagen",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: projectUpdated,
          });
        }
      );
    }
  },
  /* Método para obtener la imagen */
  getImage: (req, res) => {
    var file = req.params.image; /* upload\img\projects */
    var pathFile = "./upload/img/projects/" + file;
    /* exits es para saber si existe el archivo, pertenece a la libreria fs */
    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          status: "Error",
          message: "No se encontro la imagen",
          file: pathFile
        });
      }
    });
  },

  search: (req, res) => {
    var searchString = req.params.search;
    ProjectModel.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } },
        { builtWith: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, projects) => {
        if (err) {
          return res.status(500).send({
            status: "Error",
            message: "Error al buscar",
          });
        }
        if (!projects || projects <= 0) {
          return res.status(500).send({
            status: "Error",
            message: "No se encontraron proyectos para mostrar",
          });
        }
        return res.status(200).send({
          status: "Success",
          projects,
        });
      });
  },
  /* Fin del objeto article controlador */
};

module.exports = ProjectController;
