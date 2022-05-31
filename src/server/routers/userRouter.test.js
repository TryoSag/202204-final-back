const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const connectDB = require("../../database");
const User = require("../../database/models/User");
const mockedUsers = require("../../mocks/userMocks");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(mockedUsers[0]);
  await User.create(mockedUsers[1]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a POST/user/login endpoint", () => {
  describe("When it receives a request with an existing user in the database", () => {
    test("Then it should respond with a status 200 and a token", async () => {
      const user = {
        username: "testUser1",
        password: "testUser1",
      };

      const {
        body: { token },
      } = await request(app).post("/user/login").send(user).expect(200);

      expect(token).not.toBeNull();
    });
  });

  describe("When it receives a request with a not existing user in the database", () => {
    test("Then it should response with status error 403 and no token", async () => {
      const user = {
        username: "notExistingName",
        password: "",
      };

      const { token } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(403);

      expect(token).toBeUndefined();
    });
  });
});

describe("Given a POST/user/register endpoint", () => {
  describe("When it receives a request with new user data", () => {
    test("Then it should respnse with status 201 and the new user data with the password encrypted", async () => {
      const newUserData = {
        name: "testNewUser",
        username: "testNewUser",
        password: "testNewUser",
      };

      const {
        _body: { name, username, password },
      } = await request(app)
        .post("/user/register")
        .send(newUserData)
        .expect(201);

      expect(name).toBe(newUserData.name);
      expect(username).toBe(newUserData.username);
      expect(password).not.toBe(newUserData.password);
    });
  });
});
