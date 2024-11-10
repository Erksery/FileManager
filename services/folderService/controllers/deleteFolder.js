const { flushCache } = require("../../../commands/cache/nodeCache");

const deleteFolder = async ({ Folder, id, res }) => {
  try {
    const response = await Folder.destroy({ where: { id: id } });

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
    res.status(400).json({ error: "Произошла ошибка при удалении папки", err });
  }
};

module.exports = { deleteFolder };
