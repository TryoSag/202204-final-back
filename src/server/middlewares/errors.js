require("dotenv").config();
const debug = require("debug")("petsHouse:server:middlewares:errors");
const chalk = require("chalk");
const customError = require("../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, "Endpoint not found", "Endpoint not found");

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(chalk.red(error.customMessage));
  const message = error.message ?? "General Error";
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({ error: true, message });
};

module.exports = {
  notFoundError,
  generalError,
};
