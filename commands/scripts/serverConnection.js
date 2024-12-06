const express = require("express");
const os = require("os");
const { usersSeqDatabase } = require("../sql/connect");

const server = express();
const port = 3005;

server.use(express.static(__dirname));
server.use(express.json());

const localIP = Object.values(os.networkInterfaces())
  .flat()
  .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

console.log("Локальный IP-адрес:", localIP);

usersSeqDatabase.sync().then(() => {
  server.listen(port, localIP, () => {
    console.log(`http://${localIP}:${port}`);
  });
});

module.exports = {
  server,
};
