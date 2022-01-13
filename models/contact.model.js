const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    cliente: {
      type: String,
      required: [true, "El cliente es necesario"],
    },
    mensaje: {
      type: String,
      required: [true, "El mensaje es necesario"],
    },
    asunto: {
      type: String,
      required: [true, "El asunto es necesario"],
    },
    telefono: {
      type: String,
      required: [true, "El telefono es necesario"],
    },
    correo: {
      type: String,
      required: [true, "El correo es necesario"],
    },
    estado: {
      type: String,
      required: [true, "El estado es necesario"],
    },
  },
  { timestamps: true }
);

contactSchema.methods.toJSON = function () {
  const { __v, password, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", contactSchema);

const Contact = model("Contact", contactSchema);
module.exports = {
  Contact,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
