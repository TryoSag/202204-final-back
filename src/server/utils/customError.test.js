const customError = require("./customError");

describe("Given the customError function", () => {
  describe("When it's called and receives status 444, custom message and message 'testError'", () => {
    test("Then it should return a new error with message 'testError'", () => {
      const errorStatus = 444;
      const errorCustomMessage = "testError";
      const errorMessage = "testError";
      const expectedError = new Error(errorMessage);

      const returnedError = customError(
        errorStatus,
        errorCustomMessage,
        errorMessage
      );

      expect(returnedError).toEqual(expectedError);
    });
  });

  describe("When it's called and not receives status, custom message and message", () => {
    test("Then it should return a new error with message ''", () => {
      const expectedError = new Error("");

      const returnedError = customError();

      expect(returnedError).toEqual(expectedError);
    });
  });
});
