module.exports = (io, socket, onlineUsers) => {
  try {
    if (!socket.user || !socket.user.id) {
      console.error(
        "❌ خطأ: لم يتم العثور على بيانات المستخدم أو أنها غير صحيحة"
      );
      return;
    }
    const { name, email, id, role, age } = socket.user;
    const socketId = socket.id;

    if (!onlineUsers[id]) {
      onlineUsers[id] = {
        socketId,
        id,
        name,
        email,
        role,
        age,
      };
      socket.broadcast.emit("newUserConnected", { id, name, role, age });
      io.emit("updateOnlineUsers", Object.values(onlineUsers));
    }

    socket.on("disconnect", () => {
      if (onlineUsers[id]) {
        delete onlineUsers[id];
        io.emit("updateOnlineUsers", Object.values(onlineUsers));
        socket.broadcast.emit("userDisconnected", { id, name, role, age });
      }
    });
  } catch (error) {
    console.error("❌ خطأ في إدارة المستخدمين المتصلين:", error.message);
  }
};
