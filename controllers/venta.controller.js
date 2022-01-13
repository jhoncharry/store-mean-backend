const { request, response } = require("express");

var fs = require("fs");
var path = require("path");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const { Venta } = require("../models/venta.model");
const { DetalleVenta } = require("../models/detalle_venta.model");
const { Product } = require("../models/product.model");
const { Carrito } = require("../models/carrito.model");
const { Inventario } = require("../models/inventario.model");
const { generarJWT } = require("../helpers/jwt");

const uploadsController = require("./uploads.controller");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SK);

const bcrypt = require("bcrypt");
const slugify = require("slugify");

const createVenta = async (req = request, res = response) => {
  let data = req.body;
  let detalles = data.detalles;

  let venta_last = await Venta.find().sort({ createdAt: -1 });
  let serie;
  let correlativo;
  let numero_venta;

  if (venta_last.length === 0) {
    serie = "001";
    correlativo = "000001";

    numero_venta = serie + "-" + correlativo;
  } else {
    let last_venta = venta_last[0].numero_venta;
    let array_numero_venta = last_venta.split("-");

    if (array_numero_venta[1] !== "999999") {
      let new_correlativo = zfill(parseInt(array_numero_venta[1]) + 1, 6);
      numero_venta = array_numero_venta[0] + "-" + new_correlativo;
    } else {
      let new_serie = zfill(parseInt(array_numero_venta[0]) + 1, 3);
      numero_venta = new_serie + "-000001";
    }
  }

  data.numero_venta = numero_venta;
  data.estado = "Procesando";

  // Guardar carrito
  try {
    // Register
    const ventaSaved = await Venta.create(data);

    detalles.forEach(async (element) => {
      element.venta = ventaSaved._id;
      await DetalleVenta.create(element);

      let element_product = await Product.findById(element.product);
      let new_stock = element_product.stock - element.cantidad;

      await Product.findByIdAndUpdate(element.product, {
        stock: new_stock,
        numero_ventas: element_product.numero_ventas + 1,
      });
    });

    // Limpiar carrito
    await Carrito.deleteMany({ client: data.client });

    res.json({
      ok: true,
      ventaSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getVentas = async (req = request, res = response) => {
  let desde = req.params["desde"];
  let hasta = req.params["hasta"];

  try {
    if (!desde || desde === "null" || !hasta || hasta === "null") {
      return res.json({
        ok: true,
        data: await Venta.find()
          .populate("direccion")
          .populate("client")
          .sort({ createdAt: -1 }),
      });
    }

    const ventas = await Venta.find({
      createdAt: {
        $gte: new Date(desde + "T00:00:00.000Z"),
        $lte: new Date(hasta + "T23:59:59.000Z"),
      },
    });

    if (ventas.length <= 0) {
      return res.status(400).json({
        ok: false,
        message: "No existe ventas",
      });
    }

    res.json({
      ok: true,
      data: ventas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const createPayment = async (req = request, res = response) => {
  let data = req.body;

  try {
    const ventaChecked = await Venta.findById(data.ventaId);

    if (!ventaChecked) {
      return res.status(404).json({
        ok: false,
        message: "No existe una venta con ese Id",
      });
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: ventaChecked.subtotal * 100,
      source: data.token,
    });

    ventaChecked.set({ estado: "Completada", transaccion: charge.id });
    await ventaChecked.save();

    res.json({
      ok: true,
      data: charge.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const sendCompraEmail = async (req = request, res = response) => {
  let id = req.params["id"];

  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "jhon.charrysoftware@gmail.com",
        pass: "zlyxvbobijpqatqc",
      },
    })
  );

  //cliente _id fecha data subtotal
  const venta = await Venta.findById(id).populate("client");
  const detalles = await DetalleVenta.find({ venta: id }).populate("product");

  const cliente = venta.client.name + " " + venta.client.lastname;
  const _id = venta._id;
  const fecha = new Date(venta.createdAt);
  const data = detalles;
  const subtotal = venta.subtotal;
  const precio_envio = venta.envio_precio || 0;

  readHTMLFile(process.cwd() + "/mail.html", (err, html) => {
    let rest_html = ejs.render(html, {
      data,
      cliente,
      _id,
      fecha,
      subtotal,
      precio_envio,
    });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: "jhon.charrysoftware@gmail.com",
      to: venta.client.email,
      subject: "Gracias por tu compra, Mi Tienda",
      html: htmlToSend,
    };
    res.status(200).send({ data: true });
    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

function zfill(number, width) {
  var numberOutput = Math.abs(number);
  var length = number.toString().length;
  var zero = "0";

  if (width <= length) {
    if (number < 0) {
      return "-" + numberOutput.toString();
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return "-" + zero.repeat(width - length) + numberOutput.toString();
    } else {
      return zero.repeat(width - length) + numberOutput.toString();
    }
  }
}

module.exports = {
  createVenta,
  createPayment,
  sendCompraEmail,
  getVentas,
};
