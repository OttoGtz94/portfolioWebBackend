"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
  title: String,
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
  linkGitHub: String,
  builtWith: String,
  image: String,
});

module.exports = mongoose.model('Project', ProjectSchema);
