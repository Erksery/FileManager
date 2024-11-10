require("dotenv").config();
const jwt = require("jsonwebtoken");
const { transferRuToEN } = require("../../../commands/scripts/transferText");
const { flushCache } = require("../../../commands/cache/nodeCache");
const config = require("../../../config");

const createFile = async ({ Folder, File, enteredData, res, file, user }) => {
  try {
    const folder = await Folder.findOne({ where: { id: enteredData.folder } });

    if (!folder) {
      return res.status(404).json({ error: "Папка не найдена" });
    }

    if (!userHasPermission(user, folder)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    const fileData = await File.create({
      creator: user.id,
      folderId: enteredData.folder,
      name: transferRuToEN(file.originalname),
      originalName: file.originalname,
      type: file.mimetype,
    });

    flushCache();
    res.status(200).json({ message: "Файл успешно создан", file: fileData });
  } catch (err) {
    console.log("Ошибка при создании папки", err);
    res.status(400).json({ error: "Произошла ошибка при создании файла", err });
  }
};

const userHasPermission = (user, folder) => {
  return (
    user.role === config.roles.ADMIN ||
    user.id === folder.creator ||
    folder.privacy === config.privacy.Public
  );
};

module.exports = { createFile };
