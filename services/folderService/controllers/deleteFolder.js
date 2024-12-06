const { flushCache } = require("../../../commands/cache/nodeCache");
const config = require("../../../config");

const deleteFolder = async ({ Folder, id, res, user }) => {
  try {
    const folder = await Folder.findOne({ where: { id: id } });

    if (!folder) {
      return res.status(404).json({ error: "Папка не найдена" });
    }

    if (!userHasPermission(user, folder)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    const response = await folder.destroy({ where: { id: id } });

    if (!response) {
      return res.status(400).json({ error: "Данной папки не существует", err });
    } else {
      await Folder.destroy({ where: { inFolder: id } });
      flushCache();
      return res
        .status(200)
        .json({ message: "Папка успешно удалена", folderId: JSON.parse(id) });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Произошла ошибка при удалении папки", err });
  }
};

const userHasPermission = (user, folder) => {
  return user.role === config.roles.ADMIN || user.id === folder.creator;
};

module.exports = { deleteFolder };
