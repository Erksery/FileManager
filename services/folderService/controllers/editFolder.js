const editFolder = async ({ Folder, res, id, enteredData, user }) => {
  try {
    // Проверка входных данных
    if (!isValidInput(id, enteredData)) {
      return res
        .status(400)
        .json({ error: "Недостаточно данных для редактирования папки" });
    }

    // Поиск папки в базе данных
    const folder = await findFolderById(Folder, id);
    if (!folder) {
      return res.status(404).json({ error: "Папка не найдена" });
    }

    // Проверка прав пользователя
    if (!userHasPermission(user, folder)) {
      return res
        .status(403)
        .json({ error: "Недостаточно прав для редактирования папки" });
    }

    // Обновление папки и её вложенных подпапок
    const updateResult = await updateFolderAndSubfolders(
      folder,
      enteredData,
      Folder
    );
    return res.status(200).json(updateResult);
  } catch (err) {
    console.error("Ошибка при редактировании папки:", err);
    return res
      .status(500)
      .json({ error: "Произошла ошибка при редактировании папки" });
  }
};

const isValidInput = (id, data) => {
  return id && data && data.name?.trim() && data.privacy;
};

const findFolderById = async (Folder, id) => {
  return await Folder.findOne({ where: { id } });
};

const userHasPermission = (user, folder) => {
  return user.id === folder.creator;
};

const updateFolderAndSubfolders = async (folder, data, Folder) => {
  const updateData = { privacy: data.privacy };
  if (data.name) {
    updateData.name = data.name.trim();
  }

  await folder.update(updateData);

  // Находим все прямые дочерние папки текущей папки
  const subFolders = await Folder.findAll({ where: { inFolder: folder.id } });

  if (subFolders.length > 0) {
    await Promise.all(
      subFolders.map(async (subFolder) => {
        // Рекурсивно обновляем вложенные подпапки, передавая только поле privacy
        await updateFolderAndSubfolders(
          subFolder,
          { privacy: data.privacy },
          Folder
        );
      })
    );
  }

  return {
    message: "Папка и все её подпапки успешно отредактированы",
    folderId: folder.id,
  };
};

module.exports = { editFolder };
