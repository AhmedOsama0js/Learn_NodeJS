module.exports = (io) => {
  return {
    sendNotification: (userId, type, message) => {
      if (!userId) return;
      io.to(userId).emit("notification", { type, message });
    },

    sendGroupNotification: (room, type, message) => {
      if (!room) return;
      io.to(room).emit("notification", { type, message });
    },
  };
};
