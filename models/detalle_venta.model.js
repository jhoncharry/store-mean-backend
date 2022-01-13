const { Schema, model } = require("mongoose");

const detalleVentaSchema = new Schema(
  {
    product: {
      type: Schema.ObjectId,
      ref: "Product",
      required: [true, "El Product es necesario"],
    },
    client: {
      type: Schema.ObjectId,
      ref: "Client",
      required: [true, "El client es necesario"],
    },
    venta: {
      type: Schema.ObjectId,
      ref: "Venta",
      required: [true, "El Venta es necesario"],
    },
    subtotal: {
      type: Number,
      required: [true, "El subtotal es necesario"],
    },
    variedad: {
      type: String,
      required: [false, "El variedad es necesario"],
    },
    cantidad: {
      type: Number,
      required: [true, "El cantidad es necesario"],
    },
  },
  { timestamps: true }
);

detalleVentaSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", detalleVentaSchema);

const DetalleVenta = model("detalle_venta", detalleVentaSchema);
module.exports = {
  DetalleVenta,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
