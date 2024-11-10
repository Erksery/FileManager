require("dotenv").config();
const jwt = require("jsonwebtoken");
const { flushCache } = require("../../../commands/cache/nodeCache");
const config = require("../../../config");

const deleteFile = async ({ File, res, id, user }) => {
  try {
    const file = await File.findOne({ where: { id: id } });

    if (!file) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    if (!userHasPermission(user, file)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }
    await file.destroy();
    flushCache();
    res.status(200).json({ message: "Файл успешно удален", fileId: id });
  } catch (err) {
    console.log("Ошибка при удалении файла", err);
    res.status(400).json({ error: "Произошла ошибка при удалении файла", err });
  }
};

const userHasPermission = (user, file) => {
  return user.role === config.roles.ADMIN || user.id === file.creator;
};

module.exports = { deleteFile };
