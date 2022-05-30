require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = {
      statusCode: 403,
      message: "User or password incorrect",
      customMessage: "User incorrect",
    };

    next(error);
    return;
  }
  const userData = {
    username: user.username,
    name: user.name,
    adminUser: user.adminUser,
  };

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = {
      statusCode: 403,
      message: "User or password incorrect",
      customMessage: "Password incorrect",
    };

    next(error);
    return;
  }
  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

module.exports = {
  userLogin,
};
