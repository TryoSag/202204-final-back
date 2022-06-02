const { Schema, model } = require("mongoose");

const PetSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  sex: {
    type: String,
  },
  age: {
    type: Number,
  },
  description: {
    type: String,
  },
  SpecialTreatment: {
    type: String,
  },
});

const Pet = model("Pet", PetSchema, "pets");

module.exports = Pet;
