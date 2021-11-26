"use strict";

require("dotenv").config();
process.env.SECRET = "abcdefghijklmnopqrstuvwxyz";
const supertest = require("supertest");
const { app } = require("../src/server");
const mockReq = supertest(app);
const faker = require("faker");
const { db } = require("../src/models/index");

const newUser = {
  username: faker.name.findName(),
  password: faker.name.findName(),
  Email: faker.name.findName(),
  role: "admin",
};

beforeAll((done) => {
  done();
});

afterAll((done) => {
  db.close();
  done();
});

describe("sign-up sign-in", () => {
  it("sign up", async () => {
    const res = await mockReq.post("/signup").send(newUser);
    expect(res.status).toEqual(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toEqual(newUser.username);
  });

  it("sign in", async () => {
    const res = await mockReq
      .post("/signin")
      .auth(newUser.username, newUser.password);
    expect(res.status).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toEqual(newUser.username);
  });
});

let token;

describe("/users", () => {
  it("/users", async () => {
    const res1 = await mockReq
      .post("/signin")
      .auth(newUser.username, newUser.password);
    token = res1.body.token;
    const res = await mockReq
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(200);
  });
});
