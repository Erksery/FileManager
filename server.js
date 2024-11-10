const cors = require("cors");
const fs = require("fs");
const {
  UserData,
  Folder,
  File,
} = require("./commands/sql/models/usersDatabase");
const { server } = require("./commands/scripts/serverConnection");
const { authenticateToken } = require("./middleware/authenticateToken");
const { search } = require("./commands/scripts/search");
const fileRoutes = require("./services/fileService/fileRoutes");
const folderRoutes = require("./services/folderService/folderRoutes");
const userRoutes = require("./services/userService/userRoutes");
const adminRoutes = require("./services/adminService/adminRoutes");

server.use(cors());

server.get("/", (req, res) => {
  res.send("test");
});

server.get("/image/:id", (req, res) => {
  const name = req.params.id;
  try {
    fs.readFile(`uploads/${name}`, (err, data) => {
      if (err) {
        console.log("Ошибка при загрузке изображения", err);
        res.status(500);
      } else {
        // res.setHeader("Content-Type", "image/png");
        res.send(data);
      }
    });
  } catch (err) {
    console.log("Ошибка загрузки изображения", err);
  }
});

server.use("/user", userRoutes);

server.use("/admin", adminRoutes);

server.use("/files", fileRoutes);

server.use("/folders", folderRoutes);

server.get("/search", authenticateToken, (req, res) => {
  const enteredData = req.query;

  search({ File, Folder, res, enteredData, user: req.user });
});

/*
server.get("/file/:id", (req, res) => {
  const name = req.params.id;
  const imageTypes = ["png", "jpg", "jpeg"];
  const textTypes = ["txt"];
  try {
    fs.readFile(`uploads/${name}`, (err, data) => {
      if (err) {
        console.log("Ошибка при загрузке файла", err);
        res.status(500).send("Ошибка загрузки файла");
      } else {
        const ext = name.split(".").pop();
        if (ext === "png" || ext === "jpg" || ext === "jpeg") {
          res.setHeader("Content-Type", "image/png");
        } else if (textTypes.includes(ext)) {
          res.setHeader("Content-Type", "text/plain");
        } else {
          res.setHeader("Content-Type", "application/octet-stream");
        }
        res.send(data);
      }
    });
  } catch (err) {
    console.log("Ошибка загрузки файла", err);
    res.status(500).send("Ошибка загрузки файла");
  }
});
*/