const { use } = require("../app");

'use strict'

var express = require("express");
var router = express.Router();
var ArticleController = require("../controllers/article.controller");
var ProjectController = require("../controllers/project.controller");
var multiparty = require("connect-multiparty");
var middlewareUploadArticle = multiparty({ uploadDir: './upload/img/articles'});
var middlewareUploadProject = multiparty({ uploadDir: './upload/img/projects'});

/* Rutas de prueba */
/* router.get("/test-de-controlador", ArticleController.test);
router.post("/datos-article-controller", ArticleController.datos); */
/* Rutas funcionales para Blog */
router.post("/save-article", ArticleController.save);
router.get("/show-articles/:last?", ArticleController.get);
router.get("/article/:id", ArticleController.getArticle);
router.put("/article/:id", ArticleController.updateArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.post("/upload-image-article/:id", middlewareUploadArticle, ArticleController.uploadFiles);
router.get("/get-image-article/:image", ArticleController.getImage);
router.get("/search-article/:search", ArticleController.search);

/* Rutas funcionales para listar proyectos */
router.post("/save-project", ProjectController.save);
router.get("/show-projects/:last?", ProjectController.get);
router.get("/project/:id", ProjectController.getProject);
router.put("/project/:id", ProjectController.updateProject);
router.delete("/project/:id", ProjectController.deleteProject);
router.post("/upload-image-project/:id", middlewareUploadProject, ProjectController.uploadFiles);
router.get("/get-image-project/:image", ProjectController.getImage);
router.get("/search-project/:search", ProjectController.search);

module.exports = router;