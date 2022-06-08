const express = require("express");
const {
  getPets,
  deletePet,
  createPet,
} = require("../controllers/petsControllers");

const petsRouter = express.Router();

petsRouter.get("/", getPets);
petsRouter.delete("/:id", deletePet);
petsRouter.post("/", createPet);

module.exports = petsRouter;
