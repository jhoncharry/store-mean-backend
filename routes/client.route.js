const express = require("express");
const app = express();

const clientController = require("../controllers/client.controller");
const configController = require("../controllers/config.controller");

const { validateJWT } = require("../middlewares/validate-jwt");

// Client
app.post("/client", clientController.createClient);
app.post("/client/login", clientController.loginClient);
app.get("/client/login/renew", validateJWT, clientController.renewToken);
app.put("/client/:id", [validateJWT], clientController.updateClient);

// Direccion
app.post("/client/direccion", [validateJWT], clientController.createDireccion);
app.get(
  "/client/direccion/:id",
  [validateJWT],
  clientController.getDirecciones
);
app.get(
  "/client/direccion/principal/:id",
  [validateJWT],
  clientController.getDireccionPrincipal
);
app.put(
  "/client/direccion/:id/:client",
  [validateJWT],
  clientController.updateDireccionPrincipal
);

// Contact
app.post("/client/contact", clientController.createMensajeContacto);
app.get(
  "/client/ordenes/:id",
  [validateJWT],
  clientController.getOrdenesClient
);

// Venta
app.get(
  "/client/orden-detalle/:id",
  [validateJWT],
  clientController.getDetalleOrden
);

// Review
app.post("/client/review", [validateJWT], clientController.createReview);
app.get(
  "/client/reviews/product/:id",
  clientController.getReviewsProductPublic
);
app.get(
  "/client/reviews/product/populate/:id",
  clientController.getReviewsProductGuest
);
app.get(
  "/client/reviews/products/client/:id",
  [validateJWT],
  clientController.getReviewsClient
);

module.exports = app;
