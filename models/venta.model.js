const { Schema, model } = require("mongoose");

const ventaSchema = new Schema(
  {
    client: {
      type: Schema.ObjectId,
      ref: "Client",
      required: [true, "El client es necesario"],
    },
    numero_venta: {
      type: String,
      required: [true, "El numero_venta es necesario"],
    },
    subtotal: {
      type: Number,
      required: [true, "El subtotal es necesario"],
    },
    envio_titulo: {
      type: String,
      required: [true, "El envio_titulo es necesario"],
    },
    envio_precio: {
      type: Number,
      required: [false, "El envio_precio es necesario"],
    },
    transaccion: {
      type: String,
      required: [false, "El transaccion es necesario"],
    },
    cupon: {
      type: String,
      required: [false, "El cupon es necesario"],
    },
    estado: {
      type: String,
      required: [true, "El estado es necesario"],
    },
    direccion: {
      type: Schema.ObjectId,
      ref: "Direccion",
      required: [true, "El direccion es necesario"],
    },
    nota: {
      type: String,
      required: [false, "El nota es necesario"],
    },
  },
  { timestamps: true }
);

ventaSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", ventaSchema);

const Venta = model("Venta", ventaSchema);
module.exports = {
  Venta,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
