const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const router = require("./controllers/router");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

logger.info("connecting to MongoDB");
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());

app.use("/api/blogs", router);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
