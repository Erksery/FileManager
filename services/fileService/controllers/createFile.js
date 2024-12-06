const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
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

    const isImage = file.mimetype.startsWith("image/");
    const compressedDir = "compressedImages/";

    let compressedFilePath = "";
    if (isImage) {
      const fileNameWithoutExt = path.basename(
        file.originalname,
        path.extname(file.originalname)
      );
      const compressedFileName = `${transferRuToEN(fileNameWithoutExt)}.webp`;
      compressedFilePath = path.join(compressedDir, compressedFileName);

      if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir, { recursive: true });
      }

      // Сжатие изображения
      await compressImage(file, compressedFilePath);
    }

    // Создание записи о файле в базе данных
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
    console.log("Ошибка при создании файла", err);
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

const compressImage = (file, compressedFilePath) => {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize(800) // Сжимаем изображение (по ширине, если оно больше 800px)
      .jpeg({ quality: 60 })
      .toFile(compressedFilePath, (err, info) => {
        if (err) {
          console.log("Ошибка при сжатии изображения", err);
          reject(err);
        } else {
          console.log("Сжатое изображение сохранено:", info);
          resolve(info);
        }
      });
  });
};

module.exports = { createFile };
