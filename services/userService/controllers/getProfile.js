require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getUserData } = require("../../../commands/scripts/getUserData");

const getProfile = async ({ UserData, token, res }) => {
  try {
    jwt.verify(token, process.env.secretKey, async (err, decodedData) => {
      if (err) {
        console.log("Ошибка верификации", err);
        return res.status(401).json({ error: "Ошибка верификации токена" });
      }

      const userData = await getUserData({ id: decodedData.userId });
      res.status(200).json({ userData });
    });
  } catch (err) {
    console.log("Ошибка при получении профиля", err);
    res.status(400).json({ error: "Произошла ошибка при получении профиля" });
  }
};

module.exports = { getProfile };
