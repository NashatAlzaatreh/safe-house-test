"use strict";
require("dotenv").config();

const userModel = require("./users.js");
const profileModel = require("../models/profileModel");
const houseModel = require("../models/housesModel");
const Collection = require("../models/data-collection");

const { Sequelize, DataTypes } = require("sequelize");

const DATABASE_URL =
  process.env.NODE_ENV === "test" ? "sqlite:memory:" : process.env.DATABASE_URL;

let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const house = houseModel(sequelize, DataTypes);
const profile = profileModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  house: new Collection(house),
  profile: new Collection(profile),
};
