const { Schema, model } = require("mongoose");

const direccionSchema = new Schema(
  {
    client: {
      type: Schema.ObjectId,
      ref: "Client",
      required: [true, "El client es necesario"],
    },
    destinatario: {
      type: String,
      required: [true, "El destinatario es necesario"],
    },
    dni: {
      type: String,
      required: [true, "El dni es necesario"],
    },
    zip: {
      type: String,
      required: [true, "El zip es necesario"],
    },
    direccion: {
      type: String,
      required: [true, "El direccion es necesario"],
    },
    pais: {
      type: String,
      required: [true, "El pais es necesario"],
    },
    region: {
      type: String,
      required: [false, "El region es necesario"],
    },
    provincia: {
      type: String,
      required: [false, "El provincia es necesario"],
    },
    distrito: {
      type: String,
      required: [false, "El distrito es necesario"],
    },
    telefono: {
      type: String,
      required: [true, "El telefono es necesario"],
    },
    principal: {
      type: Boolean,
      required: [true, "El principal es necesario"],
    },
  },
  { timestamps: true }
);

direccionSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", direccionSchema);

const Direccion = model("Direccion", direccionSchema);
module.exports = {
  Direccion,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
