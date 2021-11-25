"use strict";

const express = require("express");
const acl = require("../middleware/acl");
const bearer = require("../middleware/bearer");
const { users } = require("../models");
const dataModules = require("../models");

const router = express.Router();

router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next("Invalid Model");
  }
});

router.get("/:model", bearer, acl("read"), handleGetAll);
router.get("/:model/:id", bearer, acl("read"), handleGetOne);
router.post("/:model", bearer, acl("create"), handleCreate);
router.put("/:model/:id", bearer, acl("update"), handleUpdate);
router.delete("/:model/:id", bearer, acl("delete"), handleDelete);
// Owners
router.put(
  "/:model/:id/:ownerName",
  bearer,
  acl("updateOwn"),
  handleUpdateOwner
);

router.delete(
  "/:model/:id/:ownerName",
  bearer,
  acl("deleteOwn"),
  handleDeleteOwner
);

// search location
router.get(
  "/:model/search/:location",
  bearer,
  acl("read"),
  handleSearchLocation
);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

// Owner

async function handleUpdateOwner(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let reqOwnerName = req.params.ownerName;

  if (reqOwnerName === req.user.dataValues.username) {
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } else {
    res.status(500).json("You can only delete your ads");
  }
}

async function handleDeleteOwner(req, res) {
  let id = req.params.id;
  let reqOwnerName = req.params.ownerName;

  if (reqOwnerName === req.user.dataValues.username) {
    let deletedRecord = await req.model.delete(id, reqOwnerName);
    res.status(200).json(`${reqOwnerName} ads id: ${id} deleted successfully `);
  } else {
    res.status(500).json("You can only delete your ads");
  }
}
// search location
async function handleSearchLocation(req, res) {
  const id = req.params.id;
  const location = req.params.location;

  let theRecords = await req.model.get(id, location);
  res.status(200).json(theRecords);
}

module.exports = router;
