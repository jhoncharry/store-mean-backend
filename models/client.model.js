const { Schema, model } = require("mongoose");

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es necesario"],
    },
    lastname: {
      type: String,
      required: [true, "El apellido es necesario"],
    },
    country: {
      type: String,
      required: false,
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
    profile: {
      type: String,
      default: "perfil.png",
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    dni: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

clientSchema.methods.toJSON = function () {
  const { __v, password, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", clientSchema);

const Client = model("Client", clientSchema);
module.exports = {
  Client,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
