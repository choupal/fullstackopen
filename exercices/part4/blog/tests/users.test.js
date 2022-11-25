const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");

const initialUsers = [
  {
    _id: "6380c12f5321a12a51cfa770",
    username: "GriGri",
    name: "General Grievious",
    passwordHash:
      "$2b$10$JYzq8q.y0NsX5wzX/txqu.kUsYnEBoNDG34cKssd0J99002KPqqTe",
    __v: 0,
  },
  {
    _id: "6380c1415321a12a51cfa772",
    username: "BenK",
    name: "General Kenobi",
    passwordHash:
      "$2b$10$NmMUc.vrtyxILe3bu6/9TukPrAVtA2nQvB0x/8zM/pjhZFwkc.Idu",
    __v: 0,
  },
];

// Cleaning and populating DB before Tests
beforeEach(async () => {
  await User.deleteMany({});

  for (let user of initialUsers) {
    let userObject = new User(user);
    await userObject.save();
  }
});

describe("GET Users", () => {
  test("Get All Users", async () => {
    const users = await User.find({});

    expect(users.length).toBe(initialUsers.length);

    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("POST New Users", () => {
  test("Add new user", async () => {
    const newUser = {
      username: "SkyLuke",
      name: "Luke Skywalker",
      password: "noooooooo",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length + 1);
  });

  test("Error if user exists", async () => {
    const newUser = {
      username: "BenK",
      name: "General Kenobi",
      password: "hellothere",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length);
  });

  test("Error if user length < 3", async () => {
    const newUser = {
      username: "BK",
      name: "General Kenobi",
      password: "hellothere",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length);
  });

  test("Error if no username", async () => {
    const newUser = {
      name: "General Kenobi",
      password: "hellothere",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length);
  });

  test("Error if password length < 3", async () => {
    const newUser = {
      username: "BenKen",
      name: "General Kenobi",
      password: "bk",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length);
  });

  test("Error if no password", async () => {
    const newUser = {
      username: "BenKen",
      name: "General Kenobi",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersInDB = await User.find({});
    expect(usersInDB.length).toBe(initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
