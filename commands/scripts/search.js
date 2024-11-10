const { Op, Sequelize } = require("sequelize");

const search = async ({ File, Folder, res, enteredData, user }) => {
  try {
    const folder = await Folder.findOne({ where: { id: enteredData.id } });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (folder.privacy !== "Public" && user.id !== folder.creator) {
      return res
        .status(403)
        .json({ error: "Недостаточно прав для получения данных папки" });
    }

    if (enteredData.searchValue.location === "local") {
      const files = await File.findAll({
        where: {
          folderId: enteredData.id,
          originalName: { [Op.like]: `%${enteredData.searchValue.value}%` },
        },
      });
      const fileList = files.map((file) => file.toJSON());
      return res.status(200).json(fileList);

      // Глобальный поиск файлов во всех папках, доступных пользователю
    } else {
      const accessibleFolders = await Folder.findAll({
        where: {
          [Op.or]: [{ privacy: "Public" }, { creator: user.id }],
        },
      });

      const folderIds = accessibleFolders.map((folder) => folder.id);

      const files = await File.findAll({
        where: {
          folderId: { [Op.in]: folderIds },
          originalName: { [Op.like]: `%${enteredData.searchValue.value}%` },
        },
      });

      const fileList = files.map((file) => file.toJSON());
      return res.status(200).json(fileList);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Произошла ошибка при поиске файлов" });
  }
};

module.exports = { search };
