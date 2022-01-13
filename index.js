"use strict";

require("dotenv").config({
  path: `.env.development`,
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { databaseConnection } = require("./config/database");

async function init() {
  const app = express();

  // SOCKETS
  const socketIO = require("socket.io");
  const server = require("http").createServer(app);
  // IO = esta es la comunicacion del backend
  // Aqui se mantiene una conexion directa con el servidor
  module.exports.io = socketIO(server, { cors: { origin: "*" } });
  require("./sockets/socket");

  // Configurar CORS
  app.use(cors());

  /*   app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS");
    next();
  }); */

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  await databaseConnection();

  // Configuracion global de rutas
  app.use("/api", require("./routes/index.route"));

  // Server
  server.listen(process.env.PORT, () => {
    console.log(`======================SERVER======================`);
    console.log(`API http://localhost:${process.env.PORT}`);
  });

  module.exports = app;
}

init();
