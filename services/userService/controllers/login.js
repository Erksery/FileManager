require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async ({ UserData, res, enteredData }) => {
  console.log(enteredData);
  try {
    await UserData.findOne({
      where: { login: enteredData.login },
    })
      .then((data) => {
        if (data) {
          console.log(data);
          const checkPassword = bcrypt.compareSync(
            enteredData.password,
            data.password
          );

          if (checkPassword) {
            jwt.sign(
              { userId: data.id, userLogin: data.login, userRole: data.role },
              process.env.secretKey,
              (err, token) => {
                if (err) {
                  console.log(err);
                }
                res.status(200).json({
                  message: "Авторизация прошла успешно",
                  token: token,
                });
              }
            );
          } else {
            res.status(200).json({ message: "Пароль неверный" });
          }
        }
      })
      .catch((err) => {
        console.log("Ошибка при входе в аккаунт", err);
        res.status(400).json({ error: "Произошла ошибка при входе в аккаунт" });
      });
  } catch (err) {
    console.log("Ошибка при входе в аккаунт", err);
    res.status(400).json({ error: "Произошла ошибка при входе в аккаунт" });
  }
};

module.exports = { login };
