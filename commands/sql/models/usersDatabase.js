const Sequelize = require("sequelize");
const { usersSeqDatabase } = require("../connect");

const UserData = usersSeqDatabase.define("userData", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  login: {
    type: Sequelize.STRING(12),
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.CHAR(60),
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM("User", "Admin"),
    defaultValue: "User",
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
    allowNull: false,
  },
});
const Folder = usersSeqDatabase.define("folders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(50),
    unique: false,
    allowNull: false,
  },
  creator: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inFolder: {
    type: Sequelize.INTEGER,
    allowNull: true,
    //defaultValue: null,
  },
  privacy: {
    type: Sequelize.STRING(50),
    unique: false,
    allowNull: false,
    defaultValue: "Private",
  },
});

const File = usersSeqDatabase.define("files", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  creator: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  originalName: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
});

const InviteToken = usersSeqDatabase.define("inviteTokens", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING(64),
    unique: true,
    allowNull: false,
  },
  isUsed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  creator: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Folder.hasMany(File);

module.exports = { UserData, Folder, File, InviteToken };
