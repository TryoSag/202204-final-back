const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const { userLogin, userRegister } = require("./userControllers");

describe("Given the userLogin function", () => {
  describe("When it's called with a request with the correct username and password", () => {
    test("Then it should call response with status with 200 and json with a correct token", async () => {
      const req = {
        body: { username: "correctUsername", password: "correctPassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jsonwebtoken.sign = jest.fn().mockReturnValue("correctToken");
      const expectedStatus = 200;
      const expectedToken = "correctToken";

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When it's called with a request with a wrong username", () => {
    test("Then it should call next with an error with message 'User or password incorrect'", async () => {
      const req = { body: { username: "wrongUsername" } };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      const expectedError = new Error("User or password incorrect");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's called with a request with a correct username and  wrong password", () => {
    test("Then it should call next with an error with message 'User or password incorrect'", async () => {
      const req = {
        body: { username: "correctUsername", password: "wrongPassword" },
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const expectedError = new Error("User or password incorrect");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the userRegister function", () => {
  describe("When it is called with a request with correct name, username and password", () => {
    test("Then it should call response with status with 201 and the new user username", async () => {
      const req = {
        body: {
          name: "correctName",
          username: "correctUsername",
          adminUser: false,
          password: "correctPassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(false);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
      User.create = jest.fn();
      const expectedStatus = 201;
      const expectedUser = {
        username: "correctUsername",
      };

      await userRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedUser);
    });
  });

  describe("When it's called with a request with username that is already in the database", () => {
    test("Then it should call next with an error with he message 'This user already exists'", async () => {
      const req = {
        body: { name: "", username: "existingUserame", password: "" },
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(true);
      const expectedError = new Error("This user already exists");

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's called and have and error at hashing the password", () => {
    test("Then it should call next with an error with he message 'Wrong user data'", async () => {
      const req = {
        body: {
          name: "correctName",
          username: "correctUsername",
          password: "",
        },
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      bcrypt.hash = jest.fn().mockResolvedValue(false);
      const expectedError = new Error("Wrong user data");

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
