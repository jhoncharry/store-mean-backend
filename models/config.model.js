"use strict";

const { Schema, model } = require("mongoose");

const configSchema = new Schema({
  categorias: [
    {
      type: Object,
      required: [true, "El categorias es necesario"],
    },
  ],
  titulo: {
    type: String,
    required: [true, "El titulo es necesario"],
  },
  logo: {
    type: String,
    required: [true, "El logo es necesario"],
  },
  serie: {
    type: String,
    required: [true, "El serie es necesario"],
  },
  correlativo: {
    type: String,
    required: [true, "El correlativo es necesario"],
  },
});

configSchema.methods.toJSON = function () {
  const { __v, password, ...object } = this.toObject();
  return object;
};

// module.exports = model("Admin", configSchema);

const Config = model("Config", configSchema);
module.exports = {
  Config,
};

/* const Admin = model("Admin", configSchema);
export { Admin }; */
