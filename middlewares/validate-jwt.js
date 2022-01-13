const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model");

// ================================
// Verificar Token
// ================================

const validateJWT = (req, res, next) => {
  let token = req.get("token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No hay token en la peticion",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.uid = id;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token no valido",
    });
  }
};

const validarADMIN_ROLE = async (req, res, next) => {
  const uid = req.uid;

  try {
    const adminDB = await Admin.findById(uid);

    if (!adminDB) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no existe",
      });
    }

    if (adminDB.role !== "ADMIN") {
      return res.status(403).json({
        ok: false,
        message: "No tiene privilegios para hacer eso",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Hable con el administrador",
    });
  }
};

/*
const validarADMIN_ROLE_o_MismoUsuario = async (req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {


        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no existe"
            });
        }



        if (usuarioDB.role === "ADMIN_ROLE" || uid === id) {

            next();

        } else {
            return res.status(403).json({
                ok: false,
                message: "No tiene privilegios para hacer eso"
            });

        }





    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Hable con el administrador"
        })
    }


}
 */

module.exports = {
  validateJWT,
  validarADMIN_ROLE,
};
