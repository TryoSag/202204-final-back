const Pet = require("../../database/models/Pet");
const customError = require("../utils/customError");

const getPets = async (req, res, next) => {
  const pets = await Pet.find();

  if (pets.length === 0) {
    const error = customError(404, "Pets not found", "Pets not found");

    next(error);
    return;
  }
  res.status(200).json(pets);
};

module.exports = getPets;
