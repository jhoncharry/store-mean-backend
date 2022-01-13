const express = require("express");
const app = express();

const multiparty = require("connect-multiparty");
const path = multiparty({ uploadDir: "./uploads/productos" });
const pathGaleriaProducto = multiparty({
  uploadDir: "./uploads/productos/galeria",
});
const pathConfiguraciones = multiparty({
  uploadDir: "./uploads/configuraciones",
});
const pathBannerPromocion = multiparty({
  uploadDir: "./uploads/promocion",
});

const clientController = require("../controllers/client.controller");
const adminController = require("../controllers/admin.controller");
const productController = require("../controllers/product.controller");
const cuponController = require("../controllers/cupon.controller");
const configController = require("../controllers/config.controller");
const uploadsController = require("../controllers/uploads.controller");
const descuentoController = require("../controllers/descuento.controller");
const ventaController = require("../controllers/venta.controller");

const {
  validateJWT,
  validarADMIN_ROLE,
} = require("../middlewares/validate-jwt");

// Admin
app.post("/admin", adminController.createAdmin);
app.post("/admin/login", adminController.loginAdmin);
app.get("/admin/login/renew", validateJWT, adminController.renewToken);

// Admin - Client
app.post(
  "/admin/client",
  [validateJWT, validarADMIN_ROLE],
  clientController.createClient
);
app.get(
  "/admin/clients/:tipo/:filtro?",
  [validateJWT, validarADMIN_ROLE],
  clientController.getClients
);
app.get(
  "/admin/client/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.getClient
);
app.put(
  "/admin/client/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.updateClient
);
app.delete(
  "/admin/client/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.deleteClient
);

// Admin - Product
app.post(
  "/admin/product",
  [validateJWT, validarADMIN_ROLE, path],
  productController.createProduct
);
app.get(
  "/admin/products/:filtro?",
  [validateJWT, validarADMIN_ROLE],
  productController.getProducts
);
app.get(
  "/admin/product/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.getProduct
);
app.put(
  "/admin/product/:id",
  [validateJWT, validarADMIN_ROLE, path],
  productController.updateProduct
);
app.delete(
  "/admin/product/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.deleteProduct
);
app.put(
  "/admin/variedades/product/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.updateVariedadesProduct
);
app.put(
  "/admin/galeria/product/:id",
  [validateJWT, validarADMIN_ROLE, pathGaleriaProducto],
  productController.updateGalleryProduct
);
app.put(
  "/admin/galeria/delete/product/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.deleteGaleriaProduct
);

// Admin - Inventario - Product
app.post(
  "/admin/inventario",
  [validateJWT, validarADMIN_ROLE],
  productController.createInventario
);
app.get(
  "/admin/inventario/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.getInventarioProduct
);
app.delete(
  "/admin/inventario/:id",
  [validateJWT, validarADMIN_ROLE],
  productController.deleteInventarioProduct
);

// Admin - Cupon
app.post(
  "/admin/cupon",
  [validateJWT, validarADMIN_ROLE],
  cuponController.createCupon
);
app.get(
  "/admin/cupones/:filtro?",
  [validateJWT, validarADMIN_ROLE],
  cuponController.getCupones
);
app.get(
  "/admin/cupon/:id",
  [validateJWT, validarADMIN_ROLE],
  cuponController.getCupon
);
app.put(
  "/admin/cupon/:id",
  [validateJWT, validarADMIN_ROLE],
  cuponController.updateCupon
);
app.delete(
  "/admin/cupon/:id",
  [validateJWT, validarADMIN_ROLE],
  cuponController.deleteCupon
);

// Admin - Promocion
app.post(
  "/admin/promocion",
  [validateJWT, validarADMIN_ROLE, pathBannerPromocion],
  descuentoController.createDescuento
);
app.get(
  "/admin/promociones/:filtro?",
  [validateJWT, validarADMIN_ROLE],
  descuentoController.getDescuentos
);
app.get(
  "/admin/promocion/:id",
  [validateJWT, validarADMIN_ROLE],
  descuentoController.getDescuento
);
app.put(
  "/admin/promocion/:id",
  [validateJWT, validarADMIN_ROLE, pathBannerPromocion],
  descuentoController.updateDescuento
);
app.delete(
  "/admin/promocion/:id",
  [validateJWT, validarADMIN_ROLE],
  descuentoController.deleteDescuento
);

// Admin - Configuraciones
app.get(
  "/admin/config",
  [validateJWT, validarADMIN_ROLE],
  configController.getConfig
);
app.put(
  "/admin/config/:id",
  [validateJWT, validarADMIN_ROLE, pathConfiguraciones],
  configController.updateConfig
);

// Admin - Images
app.get("/admin/upload/:tipo/:foto", uploadsController.getImage);

// Admin - Contact
app.get(
  "/admin/contacts",
  [validateJWT, validarADMIN_ROLE],
  clientController.getMensajesContacto
);
app.put(
  "/admin/contact/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.closeMensajeContacto
);

// Reviews
app.get(
  "/admin/reviews/product/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.getReviewsProductGuest
);

// Ventas
app.get(
  "/admin/ventas/:desde?/:hasta?",
  [validateJWT, validarADMIN_ROLE],
  ventaController.getVentas
);

app.get(
  "/admin/orden-detalle/:id",
  [validateJWT, validarADMIN_ROLE],
  clientController.getDetalleOrden
);

// Kpi
app.get(
  "/admin/kpi",
  [validateJWT, validarADMIN_ROLE],
  adminController.getKpiGananciasMensuales
);

module.exports = app;
