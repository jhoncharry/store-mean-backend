const express = require("express");
const app = express();

const ventaController = require("../controllers/venta.controller");

const { validateJWT } = require("../middlewares/validate-jwt");



// Carrito
app.post("/venta", [validateJWT], ventaController.createVenta);
app.post("/payment/card", [validateJWT], ventaController.createPayment);
app.get(
  "/send-email/compra/:id",
  [validateJWT],
  ventaController.sendCompraEmail
);
// app.get("/carrito/:id", [validateJWT], carritoController.getCarrito);
// app.delete("/carrito/:id", [validateJWT], carritoController.deleteCarrito);

module.exports = app;
