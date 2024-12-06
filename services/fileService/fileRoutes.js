const express = require("express");
const path = require("path");
const sharp = require("sharp");
const { File, Folder } = require("../../commands/sql/models/usersDatabase");
const { authenticateToken } = require("../../middleware/authenticateToken");
const { upload } = require("../../commands/scripts/multer");
const { createFile } = require("./controllers/createFile");
const { getFiles } = require("./controllers/getFiles");
const { editFile } = require("./controllers/editFile");
const { deleteFile } = require("./controllers/deleteFile");

const fileRoutes = express.Router();

fileRoutes.use((req, res, next) => {
  req.locals = {
    File,
    Folder,
  };
  next();
});

fileRoutes.get("/getFiles", authenticateToken, (req, res) => {
  const enteredData = req.query;

  getFiles({ ...req.locals, res, enteredData, user: req.user });
});

fileRoutes.post(
  "/createFile",
  upload.single("file"),
  authenticateToken,
  (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Файл не был загружен." });
    }

    const enteredData = req.query;

    createFile({ ...req.locals, res, file, enteredData, user: req.user });
  }
);

fileRoutes.post("/editFile/:id", authenticateToken, (req, res) => {
  const enteredData = req.body;
  const id = req.params.id;
  editFile({ ...req.locals, res, id, enteredData, user: req.user });
});

fileRoutes.delete("/deleteFile/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  deleteFile({ ...req.locals, res, id, user: req.user });
});

module.exports = fileRoutes;
