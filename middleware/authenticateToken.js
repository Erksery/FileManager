const jwt = require("jsonwebtoken");
const { getUserData } = require("../commands/scripts/getUserData");
const config = require("../config");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Пользователь не авторизован" });
  }

  try {
    const userData = jwt.verify(token, config.secretKey);
    req.user = await getUserData({ id: userData.userId });

    if (!req.user) {
      return res.status(403).json({ error: "Пользователь не найден" });
    }

    const statusErrors = {
      [config.status.PENDING]: "Регистрация не подтверждена",
      [config.status.REJECTED]: "Регистрация отклонена",
    };

    const statusError = statusErrors[req.user.status];
    if (statusError) {
      return res.status(403).json({ error: statusError });
    }

    next();
  } catch (err) {
    res.status(403).json({ error: "Ошибка токена доступа" });
  }
};

module.exports = { authenticateToken };
