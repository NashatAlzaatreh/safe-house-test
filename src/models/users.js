"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET || "secret-string";

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define("users", {
    username: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    Email: { type: DataTypes.STRING, required: true },
    role: {
      type: DataTypes.ENUM("client", "owner", "admin"),
      required: true,
      defaultValue: "client",
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          client: ["read"],
          owner: ["read", "create", "updateOwn", "deleteOwn"],
          admin: ["read", "create", "update", "delete"],
        };
        return acl[this.role];
      },
    },
  });
  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = await this.findOne({
        where: { username: parsedToken.username },
      });
      console.log(user);
      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userModel;
