const { Schema, model } = require("mongoose");

const inventarioSchema = new Schema(
  {
    product: {
      type: Schema.ObjectId,
      ref: "Product",
      required: [true, "El product es necesario"],
    },
    cantidad: {
      type: Number,
      required: [true, "El cantidad es necesario"],
    },
    admin: {
      type: Schema.ObjectId,
      ref: "Admin",
      required: [true, "El admin es necesario"],
    },
    proveedor: {
      type: String,
      required: [true, "El proveedor es necesario"],
    },
  },
  { timestamps: true }
);

inventarioSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", inventarioSchema);

const Inventario = model("Inventario", inventarioSchema);
module.exports = {
  Inventario,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
