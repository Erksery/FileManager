require("dotenv").config();
module.exports = {
  PASSWORD: process.env.PASSWORD,
  secretKey: process.env.secretKey,
  roles: { USER: "User", ADMIN: "Admin" },
  status: { PENDING: "pending", APPROVED: "approved", REJECTED: "rejected" },
  privacy: { Public: "Public", Private: "Private" },
};
