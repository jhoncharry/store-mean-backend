const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const { Product } = require("../models/product.model");
const { Inventario } = require("../models/inventario.model");
const { Cupon } = require("../models/cupon.model");
const { Config } = require("../models/config.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const getConfig = async (req = request, res = response) => {
  // let id = req.params["id"];

  try {
    const configDB = await Config.findById({ _id: "61c002212c067a5d49a1de50" });

    res.json({
      ok: true,
      data: configDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateConfig = async (req = request, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  Object.keys(data).forEach((key) => {
    if (IsJsonString(data[key])) {
      data[key] = JSON.parse(data[key]);
    }
  });

  // Actualizaciones
  try {
    // Validacion de ID
    const validateConfig = await Config.findById(id);

    if (!validateConfig) {
      return res.status(404).json({
        ok: false,
        message: "No existe un config con ese Id",
      });
    }

    // Validar que exista un archivo
    if (req.files && Object.keys(req.files).length !== 0) {
      let img_path = req.files.logo.path;
      let name = img_path.split("\\");
      let logo_name = name[2];

      data.logo = logo_name;

      await uploadsController.borrarArchivo(
        validateConfig.logo,
        "configuraciones"
      );
    }

    // Actualizamos datos
    const configDB = await Config.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: configDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  getConfig,
  updateConfig,
};
