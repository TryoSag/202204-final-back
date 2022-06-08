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

const deletePet = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Pet.findByIdAndDelete(id);

    res.status(200).json({});
  } catch {
    const error = customError(204, "Pet not found", "Pet not found");

    next(error);
  }
};

const createPet = async (req, res, next) => {
  const newPet = req.body;

  try {
    const createdPet = await Pet.create(newPet);

    res.status(201).json(createdPet);
  } catch {
    const error = customError(409, "Error at create", "Error at create");

    next(error);
  }
};

module.exports = { getPets, deletePet, createPet };
