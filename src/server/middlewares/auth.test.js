const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given the auth function", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should call next", () => {
      const req = {
        headers: { authorization: "Bearer validToken" },
      };
      const next = jest.fn();
      jwt.verify = jest.fn().mockReturnValue(true);

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with invalid token", () => {
    test("Then it should call next with error with message 'Unauthorized'", () => {
      const req = {
        headers: { authorization: "InvalidToken" },
      };
      const next = jest.fn();
      const expectedError = new Error("Unauthorized");

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
