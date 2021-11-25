"use strict";

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3456;

const authRouter = require("./routes/auth.routes");
const v1Router = require("./routes/v1.route.");
require("dotenv").config();

const notFoundHandler = require("./error-handlers/404.js");
const errorHandler = require("./error-handlers/500.js");
// const logger = require('./models/logger.js');

const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(logger);

app.use(authRouter);
app.use("/api/v1", v1Router);

app.use("*", notFoundHandler);
app.use(errorHandler);

function start() {
  app.listen(PORT, () => {
    console.log(`Server on ${PORT}`);
  });
}

module.exports = {
  start,
  app,
};
