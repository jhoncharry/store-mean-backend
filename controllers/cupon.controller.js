const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const { Product } = require("../models/product.model");
const { Inventario } = require("../models/inventario.model");
const { Cupon } = require("../models/cupon.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const createCupon = async (req = request, res = response) => {
  let data = req.body;

  console.log(data);

  // Guardar usuario
  try {
    const existeCupon = await Cupon.findOne({ codigo: data.codigo });

    if (existeCupon) {
      return res.status(400).json({
        ok: false,
        message: "El cupon ya esta registrado",
      });
    }

    // Register
    const cuponSaved = await Cupon.create(data);

    res.json({
      ok: true,
      cuponSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getCupones = async (req, res = response) => {
  /*   let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite); */

  let termino = req.params["filtro"];

  try {
    if (!termino || termino === "null") {
      return res.json({
        ok: true,
        data: await Cupon.find().sort({ createdAt: -1 }),
      });
    }

    let regex = new RegExp(termino, "i");
    res.json({
      ok: true,
      data: await Cupon.find({ codigo: regex }).sort({ createdAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getCupon = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const cuponDB = await Cupon.findById(id);

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
};

const validateCupon = async (req = request, res = response) => {
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
};

const updateCupon = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateCupon = await Cupon.findById(id);

    if (!validateCupon) {
      return res.status(404).json({
        ok: false,
        message: "No existe un cupon con ese Id",
      });
    }

    // Actualizamos datos
    const cuponDB = await Cupon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: cuponDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteCupon = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateCupon = await Cupon.findById(id);

    if (!validateCupon) {
      return res.status(404).json({
        ok: false,
        message: "No existe un cupon con ese Id",
      });
    }

    //Eliminar Cliente
    const cuponDeleted = await Cupon.findByIdAndRemove({ _id: id });

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Cupon eliminado",
      data: cuponDeleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createCupon,
  getCupones,
  getCupon,
  validateCupon,
  updateCupon,
  deleteCupon,
};
