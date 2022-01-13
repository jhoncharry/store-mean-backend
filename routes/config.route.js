const express = require("express");
const app = express();

const multiparty = require("connect-multiparty");

const configController = require("../controllers/config.controller");

app.get("/client/config", configController.getConfig);

module.exports = app;
