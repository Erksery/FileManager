const { flushCache } = require("../../../commands/cache/nodeCache");
const { getUserData } = require("../../../commands/scripts/getUserData");
const { Op, Sequelize } = require("sequelize");

const createFolder = async ({ Folder, enteredData, res, id, user }) => {
  console.log(enteredData, user);
  try {
    let privacy = "Private";

    if (id) {
      const parentFolder = await Folder.findOne({
        where: { id: id },
        attributes: ["privacy", "creator"],
      });
      if (!parentFolder) {
        return res.status(404).json({ error: "Родительская папка не найдена" });
      } else if (
        parentFolder.privacy !== "Public" &&
        user.id !== parentFolder.creator
      ) {
        return res
          .status(403)
          .json({ error: "Недостаточно прав для создания папки" });
      }
      privacy = parentFolder.privacy;
    }

    const existingFolders = await Folder.findAll({
      where: {
        name: {
          [Op.like]: `${enteredData.name}%`,
        },
        inFolder: id || null,
      },
      attributes: ["name"],
    });

    if (existingFolders.length > 0) {
      const namePattern = new RegExp(`^${enteredData.name}\\((\\d+)\\)$`);
      let maxNumber = 0;

      existingFolders.forEach((folder) => {
        const match = folder.name.match(namePattern);
        if (match && match[1]) {
          maxNumber = Math.max(maxNumber, parseInt(match[1], 10));
        }
      });

      enteredData.name = `${enteredData.name}(${maxNumber + 1})`;
    }

    const creatorData = await getUserData({ id: user.id });

    const newFolder = await Folder.create({
      name: enteredData.name,
      creator: user.id,
      inFolder: id || null,
      privacy: privacy,
    });

    newFolder.creator = creatorData;
    newFolder.inFolder = newFolder.inFolder ? Number(newFolder.inFolder) : null;

    flushCache();
    res
      .status(200)
      .json({ message: "Папка успешно создана", folder: newFolder });
  } catch (err) {
    console.error("Ошибка при создании папки:", err);
    res.status(400).json({
      error: "Произошла ошибка при создании папки",
      details: err.message,
    });
  }
};

module.exports = { createFolder };
