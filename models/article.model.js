"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  title: String,
  content: String,
  description: String,
  date: {
    type: Date,
    default: Date.now /* Para que guarde la fecha actual */,
  },
  mainLabel: String,
  image: String,
});

module.exports = mongoose.model('Article', ArticleSchema);
