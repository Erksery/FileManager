const express = require("express");
const {
  File,
  Folder,
  UserData,
  InviteToken,
} = require("../../commands/sql/models/usersDatabase");
const { authenticateToken } = require("../../middleware/authenticateToken");
const { getPendingUsers } = require("./controllers/getPendingUsers");
const {
  approveUserRegistration,
} = require("./controllers/approveUserRegistration");

const adminRoutes = express.Router();

adminRoutes.use((req, res, next) => {
  req.locals = {
    File,
    Folder,
    UserData,
    InviteToken,
  };
  next();
});

adminRoutes.get("/getPendingUsers", authenticateToken, (req, res) => {
  getPendingUsers({ ...req.locals, res, user: req.user });
});
adminRoutes.post(
  "/approveUserRegistration/:id",
  authenticateToken,
  (req, res) => {
    const id = req.params.id;
    approveUserRegistration({ ...req.locals, res, user: req.user, id });
  }
);

module.exports = adminRoutes;
