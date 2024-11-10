const { where } = require("sequelize");
const config = require("../../../config");

const approveUserRegistration = async ({ UserData, res, user, id }) => {
  try {
    if (!userHasPermission(user)) {
      return res.status(403).json({ error: "Недостаточно прав" });
    }

    const currentUser = await approveUser(UserData, id);
    await editUser(currentUser);
    res
      .status(200)
      .json({
        message: "Аккаунт пользователя успешно подтвержден",
        userId: id,
      });
  } catch (err) {
    console.error("Ошибка при подтверждении аккаунта:", err);
    return res.status(500).json({
      error: "Произошла ошибка при подтверждении аккаунта:",
    });
  }
};

const userHasPermission = (user) => {
  return user.role === config.roles.ADMIN;
};

const approveUser = async (UserData, id) => {
  const getUser = await UserData.findOne({
    where: {
      id: id,
    },
  });

  return getUser;
};

const editUser = async (getUser) => {
  return await getUser.update({ status: config.status.APPROVED });
};

module.exports = {
  approveUserRegistration,
};
