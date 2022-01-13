const express = require("express");
const app = express();

const productController = require("../controllers/product.controller");

// Products
app.get("/products/:filtro?", productController.getProducts);
app.get("/product/:slug", productController.getProductBySlug);
app.get(
  "/products/recommend/:categoria",
  productController.getProductsRecommend
);
app.get("/new/products", productController.getNewProducts);
app.get("/ventas/products", productController.getProductsMasVendidos);

module.exports = app;
