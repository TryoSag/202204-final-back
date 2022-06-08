const express = require("express");
const { getPets, deletePet } = require("../controllers/petsControllers");

const petsRouter = express.Router();

petsRouter.get("/", getPets);
petsRouter.delete("/delete", deletePet);

module.exports = petsRouter;
