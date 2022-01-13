const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const { Product } = require("../models/product.model");
const { Inventario } = require("../models/inventario.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const createProduct = async (req = request, res = response) => {
  let data = req.body;
  /*   console.log("aquiii");
  console.log(data);
  console.log(req.files); */

  let img_path = req.files.portada.path;
  let name = img_path.split("\\");
  let portada_name = name[2];

  // Guardar usuario
  try {
    const slug = slugify(data.title, { lower: true });
    const existeProduct = await Product.findOne({ slug: slug });

    if (existeProduct) {
      return res.status(400).json({
        ok: false,
        message: "El producto ya esta registrado",
      });
    }

    data.portada = portada_name;
    data.slug = slug;

    // Register
    const productSaved = await Product.create(data);

    // Inventario
    const inventarioSaved = await Inventario.create({
      admin: req.uid,
      cantidad: data.stock,
      proveedor: "Primer registro",
      product: productSaved._id,
    });

    res.json({
      ok: true,
      productSaved,
      inventarioSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getProducts = async (req, res = response) => {
  /*   let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite); */

  let termino = req.params["filtro"];

  try {
    if (!termino || termino === "null") {
      return res.json({
        ok: true,
        data: await Product.find().sort({ createdAt: -1 }),
      });
    }

    let regex = new RegExp(termino, "i");
    res.json({
      ok: true,
      data: await Product.find({ title: regex }),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getProductsRecommend = async (req, res = response) => {
  /*   let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite); */

  let categoria = req.params["categoria"];

  try {
    if (!categoria || categoria === "null") {
      return res.status(404).json({
        ok: false,
        message: "No existe un producto Termino",
      });
    }

    res.json({
      ok: true,
      data: await Product.find({ categoria }).limit(8),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getNewProducts = async (req, res = response) => {
  try {
    res.json({
      ok: true,
      data: await Product.find().sort({ createdAt: -1 }).limit(8),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getProductsMasVendidos = async (req, res = response) => {
  try {
    res.json({
      ok: true,
      data: await Product.find().sort({ numero_ventas: -1 }).limit(8),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getProduct = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const productDB = await Product.findById(id);

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getProductBySlug = async (req = request, res = response) => {
  let slug = req.params["slug"];

  try {
    const productDB = await Product.findOne({ slug });

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateProduct = await Product.findById(id);

    if (!validateProduct) {
      return res.status(404).json({
        ok: false,
        message: "No existe un producto con ese Id",
      });
    }

    const slug = slugify(data.title, { lower: true });
    data.slug = slug;

    // Validar que exista un archivo
    if (req.files && Object.keys(req.files).length !== 0) {
      let img_path = req.files.portada.path;
      let name = img_path.split("\\");
      let portada_name = name[2];

      data.portada = portada_name;

      await uploadsController.borrarArchivo(
        validateProduct.portada,
        "productos"
      );
    }

    // Actualizamos datos
    const productDB = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateVariedadesProduct = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateProduct = await Product.findById(id);

    if (!validateProduct) {
      return res.status(404).json({
        ok: false,
        message: "No existe un producto con ese Id",
      });
    }

    // Actualizamos datos
    const productDB = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateGalleryProduct = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateProduct = await Product.findById(id);

    if (!validateProduct) {
      return res.status(404).json({
        ok: false,
        message: "No existe un producto con ese Id",
      });
    }

    // Validar que exista un archivo
    if (!req.files && Object.keys(req.files).length <= 0) {
      return res.status(404).json({
        ok: false,
        message: "No se existe una archivo para guardar",
      });
    }

    let img_path = req.files.imagen.path;
    console.log(img_path);
    let name = img_path.split("\\");
    let galeria_name = name[3];

    // data.portada = galleria_name;

    /*    await uploadsController.borrarArchivo(
        validateProduct.portada,
        "productos"
      ); */

    // Actualizamos datos
    const productDB = await Product.findByIdAndUpdate(
      id,
      { $push: { gallery: { imagen: galeria_name, _id: data._id } } },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteProduct = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateProduct = await Product.findById(id);

    if (!validateProduct) {
      return res.status(404).json({
        ok: false,
        message: "No existe un cliente con ese Id",
      });
    }

    //Eliminar Cliente
    const productDeleted = await Product.findByIdAndRemove({ _id: id });

    await uploadsController.borrarArchivo(productDeleted.portada, "productos");

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Producto eliminado",
      data: productDeleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteGaleriaProduct = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateProduct = await Product.findById(id);

    if (!validateProduct) {
      return res.status(404).json({
        ok: false,
        message: "No existe un producto con ese Id",
      });
    }

    // Actualizamos datos
    const productDB = await Product.findByIdAndUpdate(
      id,
      { $pull: { gallery: { _id: data._id } } },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    const imageToDeleted = validateProduct.gallery.find(
      (element) => element._id === data._id
    );

    await uploadsController.borrarArchivo(
      imageToDeleted.imagen,
      "productos/galeria"
    );

    res.json({
      ok: true,
      data: productDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const createInventario = async (req = request, res = response) => {
  let data = req.body;

  // Guardar usuario
  try {
    // Inventario
    const inventarioSaved = await Inventario.create({
      admin: req.uid,
      ...data,
    });

    const product = await Product.findById(inventarioSaved.product);

    const new_stock =
      parseInt(product.stock) + parseInt(inventarioSaved.cantidad);

    const validateProduct = await Product.findByIdAndUpdate(
      {
        _id: inventarioSaved.product,
      },
      { stock: new_stock }
    );

    res.json({
      ok: true,
      inventarioSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getInventarioProduct = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const inventarioDB = await Inventario.find({ product: id })
      .populate("admin")
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      data: inventarioDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteInventarioProduct = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateInventario = await Inventario.findById(id);

    if (!validateInventario) {
      return res.status(404).json({
        ok: false,
        message: "No existe un inventario con ese Id",
      });
    }

    //Eliminar Cliente
    const inventarioDeleted = await Inventario.findByIdAndRemove({ _id: id });

    const product = await Product.findById(inventarioDeleted.product);

    const new_stock =
      parseInt(product.stock) - parseInt(inventarioDeleted.cantidad);

    // Validacion de ID
    const validateProduct = await Product.findByIdAndUpdate(
      {
        _id: inventarioDeleted.product,
      },
      { stock: new_stock }
    );

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Inventario eliminado",
      data: validateProduct,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductsRecommend,
  getNewProducts,
  getProductsMasVendidos,
  getProduct,
  getProductBySlug,
  updateProduct,
  updateVariedadesProduct,
  updateGalleryProduct,
  deleteGaleriaProduct,
  deleteProduct,
  createInventario,
  getInventarioProduct,
  deleteInventarioProduct,
};
