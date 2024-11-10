require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registration = async ({ UserData, res, enteredData }) => {
  try {
    const candidate = await UserData.findOne({
      where: { login: enteredData.login },
    });
    if (!candidate) {
      const hashPassword = bcrypt.hashSync(enteredData.password, 7);
      await UserData.create({
        login: enteredData.login,
        password: hashPassword,
      })
        .then((data) => {
          jwt.sign(
            { userId: data.id, userLogin: data.login },
            process.env.secretKey,
            (err, token) => {
              if (err) {
                console.log(err);
              }
              res
                .status(200)
                .json({ message: "Регистрация прошла успешно", token: token });
            }
          );
        })
        .catch((err) => {
          console.log("Ошибка при регистрации пользователя", err);
          res.status(400).json({ error: "При регистрации произошла ошибка" });
        });
    } else {
      res
        .status(400)
        .json({ error: "Пользователь с таким именем уже существует" });
    }
  } catch (err) {
    console.log("Ошибка при регистрации", err);
  }
};

module.exports = { registration };
