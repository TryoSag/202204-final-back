const debug = require("debug")("petsHouse:middlewares:auth");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization.includes("Bearer")) {
      debug(chalk.red("Authorization does not include a token bearer"));
      throw new Error();
    }
    const token = authorization.replace("Bearer ", "");

    const userId = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId;

    debug(chalk.green("Received a valid token"));

    next();
  } catch {
    const error = customError(401, "invalid token", "Unauthorized");

    next(error);
  }
};

module.exports = auth;
