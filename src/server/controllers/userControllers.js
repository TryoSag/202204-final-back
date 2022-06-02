require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const customError = require("../utils/customError");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = customError(
      403,
      "User incorrect",
      "User or password incorrect"
    );

    next(error);
    return;
  }

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = customError(
      403,
      "Password incorrect",
      "User or password incorrect"
    );

    next(error);
    return;
  }

  const userData = {
    username: user.username,
    adminUser: user.adminUser,
  };

  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

const userRegister = async (req, res, next) => {
  const { name, username, adminUser, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = customError(
      409,
      "This user already exists",
      "This user already exists"
    );

    next(error);
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  if (!encryptedPassword) {
    const error = customError(400, "Wrong user data", "Wrong user data");

    next(error);
    return;
  }

  const newUser = { name, username, adminUser, password: encryptedPassword };

  await User.create(newUser);

  res.status(201).json({ username });
};

module.exports = {
  userLogin,
  userRegister,
};
