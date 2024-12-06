const express = require("express");
const {
  File,
  Folder,
  UserData,
} = require("../../commands/sql/models/usersDatabase");
const { regValidator } = require("../../middleware/regValidator");
const { getProfile } = require("./controllers/getProfile");
const { login } = require("./controllers/login");
const { registration } = require("./controllers/registration");
const { authenticateToken } = require("../../middleware/authenticateToken");
const { validationResult } = require("express-validator");

const userRoutes = express.Router();

userRoutes.use((req, res, next) => {
  req.locals = {
    File,
    Folder,
    UserData,
  };
  next();
});

userRoutes.get("/getProfile", (req, res) => {
  const token = req.query.token;
  getProfile({ ...req.locals, res, token, user: req.user });
});

userRoutes.post("/registration", regValidator, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const enteredData = req.body;
    console.log(enteredData);
    registration({ ...req.locals, res, enteredData });
  } else {
    res.status(400).json({ error: errors.array()[0].msg });
  }
});

userRoutes.post("/login", (req, res) => {
  const enteredData = req.body;
  console.log(enteredData);
  login({ ...req.locals, res, enteredData });
});

module.exports = userRoutes;
