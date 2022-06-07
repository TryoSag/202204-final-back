const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  eMail: {
    type: String,
    required: true,
  },
  adminUser: {
    type: Boolean,
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
