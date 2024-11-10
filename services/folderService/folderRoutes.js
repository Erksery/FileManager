const express = require("express");
const { File, Folder } = require("../../commands/sql/models/usersDatabase");
const { authenticateToken } = require("../../middleware/authenticateToken");
const { getFolders } = require("./controllers/getFolders");
const { createFolder } = require("./controllers/createFolder");
const { deleteFolder } = require("./controllers/deleteFolder");
const { editFolder } = require("./controllers/editFolder");

const folderRoutes = express.Router();

folderRoutes.use((req, res, next) => {
  req.locals = {
    File,
    Folder,
  };
  next();
});

folderRoutes.get("/getFolders", authenticateToken, (req, res) => {
  getFolders({ ...req.locals, res, user: req.user });
});

folderRoutes.post("/createFolder/:id?", authenticateToken, (req, res) => {
  const enteredData = req.body;
  const id = req.params.id || null;
  createFolder({ ...req.locals, res, id, enteredData, user: req.user });
});

folderRoutes.delete("/deleteFolder/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  deleteFolder({ ...req.locals, res, id });
});

folderRoutes.post("/editFolder/:id", authenticateToken, (req, res) => {
  const enteredData = req.body;
  const id = req.params.id;

  editFolder({ ...req.locals, res, id, enteredData, user: req.user });
});

module.exports = folderRoutes;
