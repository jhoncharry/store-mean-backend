const express = require("express");
const app = express();
const multiparty = require("connect-multiparty");

const descuentoController = require("../controllers/descuento.controller");

const { validateJWT } = require("../middlewares/validate-jwt");

app.get("/client/activa/promociones", descuentoController.getDescuentosActivo);

module.exports = app;
