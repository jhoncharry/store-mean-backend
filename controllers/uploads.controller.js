const { request, response } = require("express");

const path = require("path");
const fs = require("fs");

const getImage = async (req, res = response) => {
  let tipo = req.params.tipo;
  const foto = req.params.foto;

  if (tipo.includes("-")) {
    tipo = tipo.replace("-", "/");
  }

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  // Imagen por defecto

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

function borrarArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../uploads/${tipo}/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = {
  getImage,
  borrarArchivo,
};
