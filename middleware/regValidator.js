const { body } = require("express-validator");

const regValidator = [
  body("login")
    .escape()
    .isLength({ min: 3 })
    .withMessage(`Логин пользователя не может быть меньше 3 символов`)
    .isLength({ max: 12 })
    .withMessage(`Логин пользователя не может быть больше 12 символов`),
  body("password")
    .escape()
    .isLength({ min: 5 })
    .withMessage(`Пароль пользователя не может быть меньше 5 символов`)
    .isLength({ max: 15 })
    .withMessage(`Пароль пользователя не может быть больше 15 символов`),
];

module.exports = { regValidator };
