const GLOBAL_ROOM = "globalRoom";
const notifications = require("./notifications");
const Message = require("../../models/Message");

module.exports = (io, socket, onlineUsers) => {
  const notify = notifications(io);
  const { id, name } = socket.user;
  const time = new Date();

  socket.join(GLOBAL_ROOM);
  console.debug(`👤 User ${name} has joined the global room`);

  socket.broadcast
    .to(GLOBAL_ROOM)
    .emit("userJoinedGroup", { userId: id, name });

  socket.emit("activeUsers", Object.values(onlineUsers));

  socket.on(
    "sendMessage",
    async ({ message, receiver, group = GLOBAL_ROOM }) => {
      if (!socket.user) {
        return socket.emit("error", {
          message: "❌ User is not authenticated",
        });
      }

      if (!message || message.trim() === "") {
        return socket.emit("error", { message: "❌ Message cannot be empty" });
      }

      if (!receiver && !group) {
        return socket.emit("error", {
          message: "⚠️ Either receiver or group must be specified",
        });
      }

      if (receiver && group) {
        return socket.emit("error", {
          message:
            "⚠️ Cannot send a message to both receiver and group simultaneously",
        });
      }

      try {
        const newMessage = await Message.create({
          sender: id,
          receiver,
          group,
          content: message,
        });

        io.to(GLOBAL_ROOM).emit("receiveGroupMessage", {
          sender: id,
          senderName: name,
          content: message,
          timestamp: time,
        });

        notify.sendGroupNotification(
          GLOBAL_ROOM,
          "groupMessage",
          `📢 New message from ${name}: ${message}`
        );

        socket.emit("messageSent", { message, newMessage });
      } catch (error) {
        console.error("Error storing message:", error);
        socket.emit("error", {
          message: "❌ An error occurred while storing the message",
        });
      }
    }
  );

  socket.on("getGroupMessages", async (callback) => {
    try {
      const messages = await Message.find({ group: GLOBAL_ROOM })
        .sort({
          timestamp: 1,
        })
        .populate({ path: "sender", select: "name" });
      callback(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      callback([]);
    }
  });

  socket.on("disconnect", () => {
    console.debug(`❌ User ${name} has left the global room`);
    socket.broadcast
      .to(GLOBAL_ROOM)
      .emit("userLeftGroup", { userId: id, name });
  });
};
