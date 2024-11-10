require("dotenv").config();
const jwt = require("jsonwebtoken");
const { flushCache } = require("../../../commands/cache/nodeCache");
const config = require("../../../config");

const editFile = async ({ File, enteredData, res, id, user }) => {
  try {
    const file = await File.findOne({ where: { id: id } });

    if (!file) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    if (!userHasPermission(user, file)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    await file.update({ originalName: enteredData.editName });
    flushCache();
    res
      .status(200)
      .json({ message: "Файл успешно отредактирован", fileId: id });
  } catch (err) {
    console.error("Ошибка при редактировании файла", err);
    res
      .status(500)
      .json({ error: "Произошла ошибка при редактировании файла" });
  }
};

const userHasPermission = (user, file) => {
  return user.role === config.roles.ADMIN || user.id === file.creator;
};

module.exports = { editFile };
