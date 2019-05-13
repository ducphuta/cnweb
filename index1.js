var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var models = require("./models/users");

mongoose.connect('mongodb://localhost/cnweb');