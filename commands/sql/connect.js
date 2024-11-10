require("dotenv").config();
const Sequelize = require("sequelize");

const usersSeqDatabase = new Sequelize(
  "FileManagerUsers",
  "root",
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    // logging: false,
  }
);

module.exports = {
  usersSeqDatabase,
};
