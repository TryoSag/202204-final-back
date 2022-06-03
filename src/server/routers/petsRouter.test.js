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
  await request(app).post("/user/register").send(mockedUsers[1]).expect(201);
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
    test("Then it should with status 200 and the list of pets", async () => {
      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send({
          username: mockedUsers[1].username,
          password: mockedUsers[1].password,
        })
        .expect(200);

      await Pet.create(mockedPets[0]);
      await Pet.create(mockedPets[1]);

      const { body: receivedPets } = await request(app)
        .get("/pets")
        .set("Authorization", `Bearer ${token}`);

      expect(receivedPets).toHaveLength(2);
    });
  });
});
