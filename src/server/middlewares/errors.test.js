const { notFoundError, generalError } = require("./errors");

describe("Given the notFoundError function", () => {
  describe("When it's called", () => {
    test("Then it should call next with error with and 'Endpoint not found'", () => {
      const next = jest.fn();

      const expectedError = new Error("Endpoint not found");

      notFoundError(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the generalError function", () => {
  describe("When it's called and receives an error without status code and message", () => {
    test("Then it should call response with stauts code 500, error true and message 'General Error'", () => {
      const error = { customMessage: "Test" };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const expectedStatus = 500;
      const expectedmessage = { error: true, message: "General Error" };

      generalError(error, null, res);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedmessage);
    });
  });
  describe("When it's called and receives an error with status code 444 and message 'testError'", () => {
    test("Then it should call response with status code 444, error true and message 'testError'", () => {
      const error = {
        customMessage: "Test",
        statusCode: 444,
        message: "testError",
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const expectedStatus = 444;
      const expectedmessage = { error: true, message: "testError" };

      generalError(error, null, res);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedmessage);
    });
  });
});
