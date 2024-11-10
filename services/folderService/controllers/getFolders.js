const { getUserData } = require("../../../commands/scripts/getUserData");

const getFolders = async ({ Folder, res, user }) => {
  try {
    const folders = await findFolders(Folder, user);
    const updateResults = await updateFolders(folders);

    res.status(200).json(updateResults);
  } catch (err) {
    console.log("Ошибка при получении папок", err);
    res.status(500).json({ error: "Ошибка при получении папок" });
  }
};

const findFolders = async (Folder, user) => {
  console.log(user);
  const [publicFolders, userFolders] = await Promise.all([
    Folder.findAll({ where: { privacy: "Public" } }),
    Folder.findAll({ where: { creator: user.id } }),
  ]);

  const combinedFolders = [...publicFolders, ...userFolders].map((folder) =>
    folder.toJSON()
  );
  const uniqueFolders = Array.from(
    new Set(combinedFolders.map((folder) => folder.id))
  ).map((id) => combinedFolders.find((folder) => folder.id === id));
  return uniqueFolders;
};

const updateFolders = async (folders) => {
  const update = await Promise.all(
    folders.map(async (folder) => {
      folder.creator = await getUserData({ id: folder.creator });
      return folder;
    })
  );
  return update;
};

module.exports = { getFolders };
