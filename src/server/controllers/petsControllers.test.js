const Pet = require("../../database/models/Pet");
const getPets = require("./petsControllers");

describe("Given the getPets function", () => {
  describe("When it's called and there are pets in database", () => {
    test("Then it should call response with status 200 and json group of pets", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const groupOfPets = ["pet1", "pet2", "pet3"];
      Pet.find = jest.fn().mockResolvedValue(groupOfPets);
      const expectedStatus = 200;

      await getPets(null, res);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(groupOfPets);
    });
  });

  describe("When it's called and the databse is empty", () => {
    test("Then it should call next with an error with message 'Pets not found'", async () => {
      const next = jest.fn();
      const emptyDatabase = [];
      Pet.find = jest.fn().mockResolvedValue(emptyDatabase);
      const expectedError = new Error("Pets not found");

      await getPets(null, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
