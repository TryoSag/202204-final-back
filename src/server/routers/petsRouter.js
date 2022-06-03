const express = require("express");
const getPets = require("../controllers/petsControllers");

const petsRouter = express.Router();

petsRouter.get("/", getPets);

module.exports = petsRouter;
