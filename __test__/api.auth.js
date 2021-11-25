"use strict";

require("dotenv").config();
process.env.SECRET = "abcdefghijklmnopqrstuvwxyz";
const supertest = require("supertest");
const { app } = require("../src/server");
const mock = supertest(app);
const faker = require("faker");
const fakerName = faker.name.findName();
const { db } = require("../src/models/index");

beforeAll((done) => {
  done();
});

afterAll((done) => {
  db.close();
  done();
});

describe("admin", () => {
  let token;
  let id;

  it("sign up", async () => {
    const res = await mock
      .post("/signup")
      .send({ username: fakerName, password: "dddddd", role: "admin" });
    expect(res.status).toEqual(201);
  });

  it("sign in", async () => {
    const res = await mock.post("/signin").auth(fakerName, "dddddd");
    token = res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body.user.role).toEqual("admin");
    expect(res.body.token).toEqual(token);
  });

  it("GET all", async () => {
    const res1 = await mock.post("/signin").auth(fakerName, "dddddd");
    token = res1.body.token;
    id = res2.body.id;
    const res2 = await mock
      .post("/api/v1/house")
      .send({
        location: "amman000",
        Description: "ffffffffff000f",
        price: "ffffff000fff",
        ownerName: "aaaaaaaaaa",
        phoneNumber: "n000nnnnnn",
      })
      .set({ Authorization: `Bearer ${token}` });

    const res = await mock.get(`/api/v1/house/${id}`);
    expect(res.status).toEqual(200);
    // expect(res.body[1]._id).toBeDefined();
    // expect(res.body[1].name).toEqual("Mansaf");
    // expect(res.body[1].type).toEqual("PROTIEN");
    // expect(res.body.length).toEqual(2);
  });

  xit("GET one", async () => {
    const res = await mock.get(`/api/v1/house/${id}`);
    // expect(res.status).toEqual(200);
    // expect(res.body._id).toBeDefined();
    // expect(res.body.name).toEqual("Salad");
    // expect(res.body.type).toEqual("VEGETABLE");
    expect(res.body._id).toEqual(id);
  });

  xit("DELETE", async () => {
    const res = await mock
      .delete(`/api/v1/food/${id}`)
      .set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(200);
    const res1 = await mock.get(`/api/v1/food/${id}`);
    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual(null);
    const res2 = await mock.get("/api/v1/food/");
    expect(res2.body.length).toEqual(1);
  });
});
