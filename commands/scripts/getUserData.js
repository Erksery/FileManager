const { UserData } = require("../sql/models/usersDatabase");

const getUserData = async ({ id }) => {
  try {
    const user = await UserData.findOne({
      where: { id: id },
      attributes: ["id", "login", "role", "status"],
    });

    if (user) {
      return user.get();
    }
    return null;
  } catch (err) {
    console.error("Не удалось получить пользователя", err);
    return null;
  }
};

module.exports = { getUserData };
