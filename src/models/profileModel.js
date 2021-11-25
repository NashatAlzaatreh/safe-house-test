"use strict";

const profile = (sequelize, DataTypes) =>
  sequelize.define("profile", {
    FirstName: { type: DataTypes.STRING, allowNull: false },
    LastName: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    phoneNumber: { type: DataTypes.INTEGER },
  });

module.exports = profile;
