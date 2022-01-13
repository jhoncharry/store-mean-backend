const { request, response } = require("express");

const { Admin } = require("../models/admin.model");
const { Client } = require("../models/client.model");
const { Venta } = require("../models/venta.model");
const bcrypt = require("bcrypt");

const { generarJWT } = require("../helpers/jwt");

const createAdmin = async (req = request, res = response) => {
  let data = req.body;

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  data.password = bcrypt.hashSync(data.password, 10);

  // Guardar usuario
  try {
    const existeEmail = await Admin.findOne({ email: data.email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        message: "El correo ya esta registrado",
      });
    }

    // Register
    const adminSaved = await Admin.create(data);

    // Generar el TOKEN - JWT
    // const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      adminSaved,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const loginAdmin = async (req = request, res = response) => {
  let data = req.body;

  try {
    const adminDB = await Admin.findOne({ email: data.email });

    // Verificar Email
    if (!adminDB) {
      return res.status(400).json({
        ok: false,
        message: "(Admin) o contraseña incorrectos",
      });
    }

    if (adminDB.role !== "ADMIN") {
      return res.status(400).json({
        ok: false,
        message: "This user isn't administrator",
      });
    }

    // Verificar Contraseña
    if (!bcrypt.compareSync(data.password, adminDB.password)) {
      return res.status(400).json({
        ok: false,
        message: "Admin o (contraseña) incorrecto",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(adminDB._id);

    res.json({
      ok: true,
      data: adminDB,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const renewToken = async (req, res = response) => {
  const _id = req.uid;

  // Obtener el usuario por ID
  const adminDB = await Admin.findById(_id);

  if (!adminDB || adminDB.role !== "ADMIN") {
    return res.status(400).json({
      ok: false,
      message: "This user isn't administrator",
    });
  }

  // Generar el TOKEN - JWT
  const token = await generarJWT(_id);

  res.json({
    ok: true,
    token,
    data: adminDB,
  });
};

// KPI
const getKpiGananciasMensuales = async (req = request, res = response) => {
  let enero = 0;
  let febrero = 0;
  let marzo = 0;
  let abril = 0;
  let mayo = 0;
  let junio = 0;
  let julio = 0;
  let agosto = 0;
  let septiembre = 0;
  let octubre = 0;
  let noviembre = 0;
  let diciembre = 0;

  let total_ganancia = 0;
  let total_mes = 0;
  let count_ventas = 0;
  let total_mes_anterior = 0;

  try {
    let ventasDb = await Venta.find();

    if (ventasDb.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe ventas",
      });
    }

    let current_date = new Date();
    let current_year = current_date.getFullYear();
    let current_month = current_date.getMonth() + 1;

    for (var item of ventasDb) {
      let createdAt_date = new Date(item.createdAt);
      let mes = createdAt_date.getMonth() + 1;

      if (createdAt_date.getFullYear() === current_year) {
        total_ganancia = total_ganancia + item.subtotal;

        if (mes === current_month) {
          total_mes = total_mes + item.subtotal;
          count_ventas = count_ventas + 1;
        }

        if (mes === current_month - 1) {
          total_mes_anterior = total_mes_anterior + item.subtotal;
        }

        if (mes === 1) {
          enero = enero + item.subtotal;
        } else if (mes === 2) {
          febrero = febrero + item.subtotal;
        } else if (mes === 3) {
          marzo = marzo + item.subtotal;
        } else if (mes === 4) {
          abril = abril + item.subtotal;
        } else if (mes === 5) {
          mayo = mayo + item.subtotal;
        } else if (mes === 6) {
          junio = junio + item.subtotal;
        } else if (mes === 7) {
          julio = julio + item.subtotal;
        } else if (mes === 8) {
          agosto = agosto + item.subtotal;
        } else if (mes === 9) {
          septiembre = septiembre + item.subtotal;
        } else if (mes === 10) {
          octubre = octubre + item.subtotal;
        } else if (mes === 11) {
          noviembre = noviembre + item.subtotal;
        } else if (mes === 12) {
          diciembre = diciembre + item.subtotal;
        }
      }
    }

    res.json({
      ok: true,
      data: {
        enero,
        febrero,
        marzo,
        abril,
        mayo,
        junio,
        julio,
        agosto,
        septiembre,
        octubre,
        noviembre,
        diciembre,
        total_ganancia,
        total_mes,
        count_ventas,
        total_mes_anterior,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  renewToken,
  getKpiGananciasMensuales,
};
