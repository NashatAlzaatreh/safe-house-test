"use strict";

require("dotenv").config();
process.env.SECRET = "abcdefghijklmnopqrstuvwxyz";
const supertest = require("supertest");
const { app } = require("../src/server");
const mockReq = supertest(app);
const faker = require("faker");
const fakerName = faker.name.findName();
const { db } = require("../src/models/index");

const newUser = {
  username: fakerName,
  password: "test25544422",
  Email: "test@1144511",
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

// describe("admin", () => {
//   let token;
//   let id;

//   it("GET all", async () => {
//     const res1 = await mockReq
//       .post("/signin")
//       .auth(newUser.username, newUser.password);
//     token = res1.body.token;
//     const res2 = await mockReq
//       .post("/api/v1/house")
//       .send({
//         location: "amman000",
//         Description: "ffffffffff000f",
//         price: "ffffff000fff",
//         ownerName: "aaaaaaaaaa",
//         phoneNumber: "n000nnnnnn",
//       })
//       .set({ Authorization: `Bearer ${token}` });
//     const res = await mockReq.get("/api/v1/house");
//     expect(res.status).toEqual(200);
//     // expect(res.body[1]._id).toBeDefined();
//     // expect(res.body[1].name).toEqual("Mansaf");
//     // expect(res.body[1].type).toEqual("PROTIEN");
//     // expect(res.body.length).toEqual(2);
//   });
// });
