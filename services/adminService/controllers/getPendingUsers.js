const config = require("../../../config");

const getPendingUsers = async ({ UserData, res, user }) => {
  try {
    if (!userHasPermission(user)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    res.status(200).json(await getPendingUsersData(UserData));
  } catch (err) {
    console.error(
      "Ошибка при получении не подтвержденных пользователей пользователей:",
      err
    );
    return res.status(500).json({
      error:
        "Произошла ошибка при получении не подтвержденных пользователей пользователей:",
    });
  }
};

const userHasPermission = (user) => {
  return user.role === config.roles.ADMIN;
};

const getPendingUsersData = async (UserData) => {
  return await UserData.findAll({
    where: { status: "pending" },
    attributes: ["id", "login", "role", "status"],
  });
};

module.exports = { getPendingUsers };
