const socketAuth = require("./socketAuth");
const typingEvents = require("./handlers/typingEvents");
const groupMessages = require("./handlers/groupMessages");
const privateMessages = require("./handlers/privateMessages");
const onlineStatus = require("./handlers/onlineStatus");

module.exports = (io) => {
  const onlineUsers = {};

  io.use(socketAuth);

  io.on("connection", (socket) => {
    onlineStatus(io, socket, onlineUsers);
    typingEvents(io, socket, onlineUsers);
    groupMessages(io, socket, onlineUsers);
    privateMessages(io, socket, onlineUsers);
  });
};
