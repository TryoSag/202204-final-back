const Pet = require("../../database/models/Pet");
const { getPets, deletePet } = require("./petsControllers");

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

  describe("When it's called and the database is empty", () => {
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

describe("Given the deletePet function", () => {
  describe("When it's called and receives a request with id and there are a pet with this id in the database", () => {
    test("Then it should call the response with status 200", async () => {
      const req = { params: { id: "existantId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      Pet.findByIdAndDelete = jest.fn().mockResolvedValue();
      const expectedStatus = 200;

      await deletePet(req, res, null);

      expect(res.status).toBeCalledWith(expectedStatus);
    });
  });

  describe("When it's called and receives a request with id and there are not a pet with this id in the database", () => {
    test("Then it should call next with error with message 'Pet not found'", async () => {
      const req = { params: { id: "NoExistantId" } };
      const next = jest.fn();
      Pet.findByIdAndDelete = jest.fn().mockRejectedValue();
      const expectedError = new Error("Pet not found");

      await deletePet(req, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
