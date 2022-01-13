const { request, response } = require("express");

const { Client } = require("../models/client.model");
const { Direccion } = require("../models/direccion.model");
const { Contact } = require("../models/contact.model");
const { Venta } = require("../models/venta.model");
const { DetalleVenta } = require("../models/detalle_venta.model");
const { Review } = require("../models/review.model");
const bcrypt = require("bcrypt");

const { generarJWT } = require("../helpers/jwt");

const createClient = async (req = request, res = response) => {
  let data = req.body;

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  data.password = bcrypt.hashSync(data.password, 10);

  // Guardar usuario
  try {
    const existeEmail = await Client.findOne({ email: data.email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        message: "El correo ya esta registrado",
      });
    }

    // Register
    const clientSaved = await Client.create(data);

    res.json({
      ok: true,
      clientSaved,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const loginClient = async (req = request, res = response) => {
  let data = req.body;

  try {
    const clientDB = await Client.findOne({ email: data.email });

    // Verificar Email
    if (!clientDB) {
      return res.status(400).json({
        ok: false,
        message: "(Client) o contraseña incorrectos",
      });
    }

    // Verificar Contraseña
    if (!bcrypt.compareSync(data.password, clientDB.password)) {
      return res.status(400).json({
        ok: false,
        message: "Client o (contraseña) incorrecto",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(clientDB.id);

    res.json({
      ok: true,
      data: clientDB,
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
  const clientDB = await Client.findById(_id);

  if (!clientDB) {
    return res.status(400).json({
      ok: false,
      message: "This user doens't exists",
    });
  }

  // Generar el TOKEN - JWT
  const token = await generarJWT(_id);

  res.json({
    ok: true,
    token,
    data: clientDB,
  });
};

const getClients = async (req, res = response) => {
  /*   let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite); */

  let tipo = req.params["tipo"];
  let termino = req.params["filtro"];

  try {
    if (!tipo || tipo === "null") {
      res.json({
        ok: true,
        data: await Client.find(),
      });
    } else {
      if (tipo === "apellidos") {
        let regex = new RegExp(termino, "i");
        res.json({
          ok: true,
          data: await Client.find({ lastname: regex }),
        });
      } else if (tipo === "correo") {
        let regex = new RegExp(termino, "i");
        res.json({
          ok: true,
          data: await Client.find({ email: regex }),
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getClient = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const clientDB = await Client.findById(id);

    res.json({
      ok: true,
      data: clientDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateClient = async (req = request, res = response) => {
  let id = req.params["id"];
  let body = req.body;

  // Actualizaciones
  try {
    // Validacion de ID
    const validateClient = await Client.findById(id);

    if (!validateClient) {
      return res.status(404).json({
        ok: false,
        message: "No existe un usuario con ese Id",
      });
    }

    // Actualizamos datos
    const clientDB = await Client.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.json({
      ok: true,
      data: clientDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const deleteClient = async (req, res = response) => {
  let id = req.params["id"];

  /*   let cambiarEstado = {
    estado: false,
  }; */

  // Actualizaciones
  try {
    // Validacion de ID
    const validateClient = await Client.findById(id);

    if (!validateClient) {
      return res.status(404).json({
        ok: false,
        message: "No existe un cliente con ese Id",
      });
    }

    //Eliminar Cliente
    const clienteDeleted = await Client.findByIdAndRemove({ _id: id });

    // Actualizamos datos
    // const usuarioBorrado = await Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true });

    return res.json({
      ok: true,
      message: "Cliente eliminado",
      data: clienteDeleted,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

// DIRECCION

const createDireccion = async (req = request, res = response) => {
  let data = req.body;

  // Guardar direccion
  try {
    if (data.principal) {
      const checkDirecciones = await Direccion.find({
        client: data.client,
      });

      checkDirecciones.forEach(async (element) => {
        await Direccion.findByIdAndUpdate(
          { _id: element._id },
          { principal: false }
        );
      });
    }

    // Register
    const direccionSaved = await Direccion.create(data);

    res.json({
      ok: true,
      direccionSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDirecciones = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const direccionDB = await Direccion.find({ client: id })
      .populate("client")
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      data: direccionDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDireccionPrincipal = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const direccionDB = await Direccion.findOne({
      client: id,
      principal: true,
    });

    if (!direccionDB) {
      return res.status(400).json({
        ok: false,
        message: "No existe una direccion principal",
      });
    }

    res.json({
      ok: true,
      data: direccionDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const updateDireccionPrincipal = async (req = request, res = response) => {
  let id = req.params["id"];
  let client = req.params["client"];

  // Guardar direccion
  try {
    // Validacion de ID
    const validateDireccion = await Direccion.findById(id);

    if (!validateDireccion) {
      return res.status(404).json({
        ok: false,
        message: "No existe un direccion con ese Id",
      });
    }

    const checkDirecciones = await Direccion.find({
      client,
    });

    checkDirecciones.forEach(async (element) => {
      await Direccion.findByIdAndUpdate(
        { _id: element._id },
        { principal: false }
      );
    });

    // Register
    const direccionUpdate = await Direccion.findByIdAndUpdate(id, {
      principal: true,
    });

    res.json({
      ok: true,
      data: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

// CONTACTO
const createMensajeContacto = async (req = request, res = response) => {
  let data = req.body;
  data.estado = "Abierto";

  // Guardar direccion
  try {
    // Register
    const contactSaved = await Contact.create(data);

    res.json({
      ok: true,
      contactSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getMensajesContacto = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
      data: await Contact.find().sort({ createdAt: -1 }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const closeMensajeContacto = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    // Validacion de ID
    const validateContact = await Contact.findById(id);

    if (!validateContact) {
      return res.status(404).json({
        ok: false,
        message: "No existe mensaje con ese Id",
      });
    }

    // Actualizamos datos
    const mensajeDB = await Contact.findByIdAndUpdate(
      id,
      { estado: "Cerrado" },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.json({
      ok: true,
      data: mensajeDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

// ORDENES
const getOrdenesClient = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const ordenesDB = await Venta.find({
      client: id,
    }).sort({ createdAt: -1 });

    if (ordenesDB.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe ordenes de este cliente",
      });
    }

    res.json({
      ok: true,
      data: ordenesDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getDetalleOrden = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const ordenDB = await Venta.findById(id)
      .populate("direccion")
      .populate("client");

    if (!ordenDB) {
      return res.status(400).json({
        ok: false,
        message: "No existe una venta con ese ID",
      });
    }

    const ordenDetallesDB = await DetalleVenta.find({ venta: id }).populate(
      "product"
    );

    if (ordenDetallesDB.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe detalles de esa orden",
      });
    }

    res.json({
      ok: true,
      venta: ordenDB,
      detalle_venta: ordenDetallesDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

// REVIEW
const createReview = async (req = request, res = response) => {
  let data = req.body;

  // Guardar direccion
  try {
    // Register
    const reviewSaved = await Review.create(data);

    res.json({
      ok: true,
      reviewSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getReviewsProductPublic = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const reviewsDB = await Review.find({
      product: id,
    }).sort({ createdAt: -1 });

    if (reviewsDB.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe reviews de este producto",
      });
    }

    res.json({
      ok: true,
      data: reviewsDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getReviewsProductGuest = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const reviewsDB = await Review.find({
      product: id,
    })
      .sort({ createdAt: -1 })
      .populate("client");

    if (reviewsDB.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe reviews de este producto",
      });
    }

    res.json({
      ok: true,
      data: reviewsDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getReviewsClient = async (req = request, res = response) => {
  let id = req.params["id"];

  try {
    const reviewsDB = await Review.find({
      client: id,
    })
      .sort({ createdAt: -1 })
      .populate("client");

    if (reviewsDB.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe reviews de este cliente",
      });
    }

    res.json({
      ok: true,
      data: reviewsDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  createClient,
  loginClient,
  renewToken,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  createDireccion,
  getDirecciones,
  getDireccionPrincipal,
  updateDireccionPrincipal,
  createMensajeContacto,
  getMensajesContacto,
  closeMensajeContacto,
  getOrdenesClient,
  getDetalleOrden,
  createReview,
  getReviewsProductPublic,
  getReviewsProductGuest,
  getReviewsClient,
};
