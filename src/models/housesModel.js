"use strict";

const house = (sequelize, DataTypes) =>
  sequelize.define("houses", {
    location: { type: DataTypes.STRING, allowNull: false },
    Description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    ownerName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
  });

module.exports = house;
