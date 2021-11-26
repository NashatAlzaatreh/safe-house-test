"use strict";

require("dotenv").config();
process.env.SECRET = "abcdefghijklmnopqrstuvwxyz";
const supertest = require("supertest");
const { app } = require("../src/server");
const mockReq = supertest(app);
const faker = require("faker");
const { db } = require("../src/models/index");

let users = {
  admin: {
    username: faker.name.findName(),
    password: "test",
    Email: "test",
    role: "admin",
  },
  // editor: { username: faker.name.findName(), password: "test", role: "editor" },
  // user: { username: faker.name.findName(), password: "test", role: "user" },
};

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe("sign-up sign-in", () => {
  Object.keys(users).forEach((user) => {
    it("sign up", async () => {
      const res = await mockReq.post("/signup").send(users[user]);
      expect(res.status).toEqual(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toEqual(users[user].username);
    });

    it("sign in", async () => {
      const res = await mockReq
        .post("/signin")
        .auth(users[user].username, users[user].password);
      expect(res.status).toEqual(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toEqual(users[user].username);
    });
  });
});

let token;

describe("/users", () => {
  it("/users", async () => {
    const res1 = await mockReq
      .post("/signin")
      .auth(users.admin.username, users.admin.password);
    token = res1.body.token;
    const res = await mockReq
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(200);
  });
});
