if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { router } = require("./routers");
const cors = require("cors");

const express = require("express");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

module.exports = app;
