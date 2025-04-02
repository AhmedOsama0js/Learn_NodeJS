// const Message = require("../../models/Message");

// module.exports = (io, socket, onlineUsers) => {
//   console.debug(`✅ Private chat activated for: ${socket.user.name}`);

//   socket.on("privateMessage", async ({ receiverId, message }) => {
//     if (!socket.user) {
//       return socket.emit("error", { message: "❌ User is not authenticated" });
//     }

//     const senderId = socket.user.id;
//     const senderName = socket.user.name;

//     if (!onlineUsers[receiverId]) {
//       return socket.emit("error", { message: "❌ User is not online" });
//     }

//     // Send the message to the receiver
//     io.to(onlineUsers[receiverId].socketId).emit("receivePrivateMessage", {
//       senderId,
//       senderName,
//       message,
//     });

//     // Send the same message back to the sender
//     io.to(socket.id).emit("receivePrivateMessage", {
//       senderId, // because the sender is the same
//       senderName,
//       message,
//     });

//     console.debug(
//       `📩 Private message from ${senderName} to ${onlineUsers[receiverId].name}: ${message}`
//     );

//     try {
//       // Store the message in the database
//       const newMessage = await Message.create({
//         sender: senderId,
//         receiver: receiverId,
//         content: message,
//       });

//       console.debug("✅ Message stored in the database:", newMessage);
//     } catch (error) {
//       console.error("❌ Error occurred while storing the message:", error);
//       socket.emit("error", {
//         message: "❌ Error occurred while storing the message",
//       });
//     }
//   });

//   // -------------------

//   socket.on("getPrivetMessages", async ({ receiverId }, callback) => {
//     try {
//       const messages = await Message.find({
//         $or: [
//           { sender: socket.user._id, receiver: receiverId },
//           { sender: receiverId, receiver: socket.user._id },
//         ],
//       })
//         .sort({ timestamp: 1 })
//         .populate({ path: "sender", select: "name" })
//         .populate({ path: "receiver", select: "name" });

//       callback(messages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       callback([]);
//     }
//   });

//   // ------------- userChatInfo----------------
//   socket.on("getUserInfo", ({ receiverId }, callback) => {
//     if (!onlineUsers[receiverId]) {
//       return callback({ error: "❌ User is not online" });
//     }

//     const receiverName = onlineUsers[receiverId].name;
//     callback({ receiverName });
//   });
// };
const Message = require("../../models/Message");

module.exports = (io, socket, onlineUsers) => {
  const time = new Date();
  console.debug(`✅ Private chat activated for: ${socket.user.name}`);

  socket.on("privateMessage", async ({ receiverId, message }) => {
    if (!socket.user) {
      return socket.emit("error", { message: "❌ User is not authenticated" });
    }

    const sender = socket.user.id;
    const senderName = socket.user.name;

    if (!onlineUsers[receiverId]) {
      return socket.emit("error", { message: "❌ User is not online" });
    }

    io.to(onlineUsers[receiverId].socketId).emit("receivePrivateMessage", {
      sender,
      senderName,
      content: message,
      timestamp: time,
    });

    io.to(socket.id).emit("receivePrivateMessage", {
      sender,
      senderName,
      content: message,
      timestamp: time,
    });

    console.debug(
      `📩 Private message from ${senderName} to ${onlineUsers[receiverId].name}: ${message}`
    );

    try {
      const newMessage = await Message.create({
        sender,
        receiver: receiverId,
        content: message,
      });

      console.debug("✅ Message stored in the database:", newMessage);
    } catch (error) {
      console.error("❌ Error occurred while storing the message:", error);
      socket.emit("error", {
        message: "❌ Error occurred while storing the message",
      });
    }
  });

  // -------------------

  socket.on("getPrivateMessages", async ({ receiverId }, callback) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: socket.user._id, receiver: receiverId },
          { sender: receiverId, receiver: socket.user._id },
        ],
      })
        .sort({ timestamp: 1 })
        .populate({ path: "sender", select: "name" })
        .populate({ path: "receiver", select: "name" });

      callback(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      callback([]);
    }
  });

  // ------------- userChatInfo----------------
  socket.on("getUserInfo", ({ receiverId }, callback) => {
    if (!onlineUsers[receiverId]) {
      return callback({ error: "❌ User is not online" });
    }

    const receiverName = onlineUsers[receiverId].name;
    callback({ receiverName });
  });
};
