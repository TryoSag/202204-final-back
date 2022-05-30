const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const { userLogin } = require("./userControllers");

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
    test("Then it should call the next with an error with message 'User or password incorrect'", async () => {
      const req = { body: { username: "wrongUsername" } };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      const expectedError = new Error("User or password incorrect");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's called with a request with a correct username and  wrong password", () => {
    test("Then it should call the next with an error with message 'User or password incorrect'", async () => {
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
