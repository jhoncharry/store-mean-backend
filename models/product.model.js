const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El title es necesario"],
    },
    slug: {
      type: String,
      required: [true, "El slug es necesario"],
    },
    gallery: [
      {
        type: Object,
        required: false,
      },
    ],
    portada: {
      type: String,
      required: [true, "El portada es necesario"],
    },
    price: {
      type: Number,
      required: [true, "La price es obligatoria"],
    },
    description: {
      type: String,
      required: [true, "El description es necesario"],
    },
    contenido: {
      type: String,
      required: [true, "El contenido es necesario"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es necesario"],
    },
    numero_ventas: {
      type: Number,
      default: 0,
      required: [true, "El numero_ventas es necesario"],
    },
    numero_puntos: {
      type: Number,
      default: 0,
      required: [true, "El numero_puntos es necesario"],
    },
    titulo_variedad: {
      type: String,
      required: false,
    },
    variedades: [
      {
        type: Object,
        required: false,
      },
    ],
    categoria: {
      type: String,
      required: [true, "El categoria es necesario"],
    },
    estado: {
      type: String,
      default: "Edicion",
      required: [true, "El estado es necesario"],
    },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", productSchema);

const Product = model("Product", productSchema);
module.exports = {
  Product,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
