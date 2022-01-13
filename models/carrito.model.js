const { Schema, model } = require("mongoose");

const carritoSchema = new Schema(
  {
    product: {
      type: Schema.ObjectId,
      ref: "Product",
      required: [true, "El product es necesario"],
    },
    client: {
      type: Schema.ObjectId,
      ref: "Client",
      required: [true, "El client es necesario"],
    },
    cantidad: {
      type: Number,
      required: [true, "El cantidad es necesario"],
    },
    variedad: {
      type: String,
      required: [false, "El variedad es necesario"],
    },
  },
  { timestamps: true }
);

carritoSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", carritoSchema);

const Carrito = model("Carrito", carritoSchema);
module.exports = {
  Carrito,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
