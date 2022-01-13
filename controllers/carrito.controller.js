const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const { Product, Carrito } = require("../models/carrito.model");
const { Inventario } = require("../models/inventario.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const createCarrito = async (req = request, res = response) => {
  let data = req.body;

  // Guardar carrito
  try {
    const checkCarrito = await Carrito.find({
      client: data.client,
      product: data.product,
    });

    if (checkCarrito.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe un carrito con ese producto",
      });
    }

    // Register
    const carritoSaved = await Carrito.create(data);

    res.json({
      ok: true,
      carritoSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getCarrito = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const carritoDB = await Carrito.find({ client: id }).populate("product");

    res.json({
      ok: true,
      data: carritoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteCarrito = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateCarrito = await Carrito.findById(id);

    if (!validateCarrito) {
      return res.status(404).json({
        ok: false,
        message: "No existe un carrito con ese Id",
      });
    }

    //Eliminar Carrito
    const carritoDeleted = await Carrito.findByIdAndRemove({ _id: id });

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Carrito item eliminado",
      data: carritoDeleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createCarrito,
  getCarrito,
  deleteCarrito,
};
