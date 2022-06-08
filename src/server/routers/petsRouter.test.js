const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("../index");
const connectDB = require("../../database");
const Pet = require("../../database/models/Pet");
const mockedPets = require("../../mocks/petsMocks");
const User = require("../../database/models/User");
const mockedUsers = require("../../mocks/userMocks");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await request(app).post("/user/register").send(mockedUsers[0]).expect(201);
});

afterEach(async () => {
  await User.deleteMany({});
  await Pet.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the GET/pets/pets endpoint", () => {
  describe("When it receives a request of list of pets and a correct token", () => {
    test("Then it should return status 200 and the list of pets", async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: mockedUsers[0].username,
          password: mockedUsers[0].password,
        })
        .expect(200);

      await Pet.create(mockedPets[0]);
      await Pet.create(mockedPets[1]);

      const { body: receivedPets } = await request(app)
        .get("/pets")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(receivedPets).toHaveLength(2);
    });
  });
});

describe("Given the DELETE/pets/delete endpoint", () => {
  describe("When it receives a request with the id of a pet and a correct token", () => {
    test("Then it should delete pet from the database and return status 200", async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: mockedUsers[0].username,
          password: mockedUsers[0].password,
        })
        .expect(200);

      const petCreated = await Pet.create(mockedPets[0]);
      const { id } = petCreated;

      await request(app)
        .delete(`/pets/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

describe("Given the POST/pets/ endpoint", () => {
  describe("When it receives a request with the newPet and a correct token", () => {
    test("Then it should create the pet in database and return status 201 and the response body have the property 'id'", async () => {
      const expectedPetsOnDatabase = 1;
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: mockedUsers[0].username,
          password: mockedUsers[0].password,
        })
        .expect(200);

      const { body } = await request(app)
        .post("/pets/create")
        .send(mockedPets[0])
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
      const petsOnDatabase = await Pet.find();

      expect(petsOnDatabase).toHaveLength(expectedPetsOnDatabase);
      expect(body).toHaveProperty("id");
    });
  });
});
