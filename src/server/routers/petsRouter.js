const express = require("express");
const getPets = require("../controllers/petsControllers");

const petsRouter = express.Router();

petsRouter.get("/pets", getPets);

module.exports = petsRouter;
