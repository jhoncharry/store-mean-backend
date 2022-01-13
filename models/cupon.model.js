const { Schema, model } = require("mongoose");

const cuponSchema = new Schema(
  {
    codigo: {
      type: String,
      required: [true, "El codigo es necesario"],
    },
    tipo: {
      type: String,
      required: [true, "El tipo es necesario"],
    },
    valor: {
      type: Number,
      required: [true, "El valor es necesario"],
    },
    limite: {
      type: Number,
      required: [true, "El limite es necesario"],
    },
  },
  { timestamps: true }
);

cuponSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", cuponSchema);

const Cupon = model("Cupon", cuponSchema);
module.exports = {
  Cupon,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
