const express = require("express");
const app = express();

const carritoController = require("../controllers/carrito.controller");

const { validateJWT } = require("../middlewares/validate-jwt");

// Carrito
app.post("/carrito", [validateJWT], carritoController.createCarrito);
app.get("/carrito/:id", [validateJWT], carritoController.getCarrito);
app.delete("/carrito/:id", [validateJWT], carritoController.deleteCarrito);

module.exports = app;
