const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
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
    venta: {
      type: Schema.ObjectId,
      ref: "Venta",
      required: [true, "El venta es necesario"],
    },
    review: {
      type: String,
      required: [true, "El review es necesario"],
    },
    estrellas: {
      type: Number,
      required: [true, "El estrellas es necesario"],
    },
  },
  { timestamps: true }
);

reviewSchema.methods.toJSON = function () {
  const { __v, ...object } = this.toObject();
  return object;
};

// module.exports = model("Client", reviewSchema);

const Review = model("Review", reviewSchema);
module.exports = {
  Review,
};

/* const Admin = model("Admin", adminSchema);
export { Admin }; */
