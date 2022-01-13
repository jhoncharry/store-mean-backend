const express = require("express");
const app = express();

app.use(require("./client.route"));
app.use(require("./product.route"));
app.use(require("./admin.route"));
app.use(require("./config.route"));
app.use(require("./carrito.route"));
app.use(require("./venta.route"));
app.use(require("./cupon.route"));
app.use(require("./descuento.route"));

module.exports = app;
