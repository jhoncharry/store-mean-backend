"use strict";

const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  lastname: {
    type: String,
    required: [true, "El apellido es necesario"],
  },
  email: {
    type: String,
    required: [true, "El correo es necesario"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
  },
});

adminSchema.methods.toJSON = function () {
  const { __v, password, ...object } = this.toObject();
  return object;
};

// module.exports = model("Admin", adminSchema);

const Admin = model("Admin", adminSchema);
module.exports = {
  Admin,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
