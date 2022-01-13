const { Schema, model } = require("mongoose");

const descuentoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "El titulo es necesario"],
    },
    banner: {
      type: String,
      required: [true, "El tipo es necesario"],
    },
    descuento: {
      type: Number,
      required: [true, "El tipo es necesario"],
    },
    fecha_inicio: {
      type: String,
      required: [true, "El tipo es necesario"],
    },
    fecha_fin: {
      type: String,
      required: [true, "El tipo es necesario"],
    },
  },
  { timestamps: true }
);

descuentoSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", descuentoSchema);

const Descuento = model("Descuento", descuentoSchema);
module.exports = {
  Descuento,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
