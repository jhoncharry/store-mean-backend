const express = require("express");
const app = express();

const cuponController = require("../controllers/cupon.controller");

const { validateJWT } = require("../middlewares/validate-jwt");
// Cupon
app.get("/cupon/:cupon", [validateJWT], cuponController.validateCupon);

module.exports = app;
