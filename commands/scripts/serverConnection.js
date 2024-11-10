const express = require("express");
const { usersSeqDatabase } = require("../sql/connect");

const server = express();
const port = 3005;

server.use(express.static(__dirname));
server.use(express.json());

usersSeqDatabase.sync().then(() => {
  server.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});

module.exports = {
  server,
};
