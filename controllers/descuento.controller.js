const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const { Product } = require("../models/product.model");
const { Inventario } = require("../models/inventario.model");
const { Cupon } = require("../models/cupon.model");
const { Descuento } = require("../models/descuento.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const createDescuento = async (req = request, res = response) => {
  let data = req.body;

  let img_path = req.files.banner.path;
  let name = img_path.split("\\");
  let banner_name = name[2];

  // Guardar usuario
  try {
    data.banner = banner_name;

    // Register
    const descuentoSaved = await Descuento.create(data);

    res.json({
      ok: true,
      descuentoSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDescuentos = async (req, res = response) => {
  /*   let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite); */

  let termino = req.params["filtro"];

  try {
    if (!termino || termino === "null") {
      return res.json({
        ok: true,
        data: await Descuento.find().sort({ createdAt: -1 }),
      });
    }

    let regex = new RegExp(termino, "i");
    res.json({
      ok: true,
      data: await Descuento.find({ titulo: regex }).sort({ createdAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDescuentosActivo = async (req, res = response) => {
  let descuentos_array = [];

  try {
    let descuentos = await Descuento.find().sort({ createdAt: -1 });

    let today = Date.parse(new Date().toString()) / 1000;

    descuentos.forEach((element) => {
      let time_inicio = Date.parse(element.fecha_inicio + "T00:00:00") / 1000;
      let time_fin = Date.parse(element.fecha_fin + "T00:00:00") / 1000;

      if (today >= time_inicio && today <= time_fin) {
        descuentos_array.push(element);
      }
    });

    if (descuentos_array.length <= 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron promociones",
      });
    }

    res.json({
      ok: true,
      data: descuentos_array,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDescuento = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const descuentoDB = await Descuento.findById(id);

    res.json({
      ok: true,
      data: descuentoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

/* const validateCupon = async (req = request, res = response) => {
  let cupon = req.params["cupon"];

  try {
    const cuponDB = await Cupon.findOne({ codigo: cupon });

    if (cuponDB.limite === 0) {
      return res.status(400).json({
        ok: false,
        message: "No hay  cupones disponibles",
      });
    }

    res.json({
      ok: true,
      data: cuponDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
}; */

const updateDescuento = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateDescuento = await Descuento.findById(id);

    if (!validateDescuento) {
      return res.status(404).json({
        ok: false,
        message: "No existe un descuento con ese Id",
      });
    }

    // Validar que exista un archivo
    if (req.files && Object.keys(req.files).length !== 0) {
      let img_path = req.files.banner.path;
      let name = img_path.split("\\");
      let banner_name = name[2];

      data.banner = banner_name;

      await uploadsController.borrarArchivo(
        validateDescuento.banner,
        "promocion"
      );
    }

    // Actualizamos datos
    const descuentoDB = await Descuento.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: descuentoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteDescuento = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateDescuento = await Descuento.findById(id);

    if (!validateDescuento) {
      return res.status(404).json({
        ok: false,
        message: "No existe un descuento con ese Id",
      });
    }

    //Eliminar Cliente
    const descuentoDeleted = await Descuento.findByIdAndRemove({ _id: id });

    await uploadsController.borrarArchivo(descuentoDeleted.banner, "promocion");

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Descuento eliminado",
      data: descuentoDeleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createDescuento,
  getDescuentos,
  getDescuento,
  getDescuentosActivo,
  updateDescuento,
  deleteDescuento,
};
