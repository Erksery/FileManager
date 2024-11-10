const multer = require("multer");
const { transferRuToEN } = require("./transferText");

const uploadDir = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const translateFileName = transferRuToEN(file.originalname);
    cb(null, translateFileName);
    console.log("Файл записан по именем: ", translateFileName);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
