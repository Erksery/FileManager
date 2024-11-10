const { setCache, getCache } = require("../../../commands/cache/nodeCache");
const config = require("../../../config");

const getFiles = async ({ File, Folder, res, enteredData, user }) => {
  const cacheKey = `file_${enteredData.id}`;

  const cacheFiles = getCache(cacheKey);
  /*
  if (cacheFiles) {
    return res.status(200).json(cacheFiles);
  }*/

  try {
    const folder = await Folder.findOne({ where: { id: enteredData.id } });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (!userHasPermission(user, folder)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    const files = await File.findAll({ where: { folderId: enteredData.id } });
    const fileList = files.map((file) => file.toJSON());

    // Cache the file list
    setCache(cacheKey, fileList);

    return res.status(200).json(fileList);
  } catch (err) {
    console.error("Ошибка при получении файлов:", err);

    if (!res.headersSent) {
      return res.status(500).json({ error: "Ошибка при получении файлов" });
    }
  }
};

const userHasPermission = (user, folder) => {
  return (
    //user.role === config.roles.ADMIN ||
    user.id === folder.creator || folder.privacy === config.privacy.Public
  );
};

module.exports = { getFiles };
