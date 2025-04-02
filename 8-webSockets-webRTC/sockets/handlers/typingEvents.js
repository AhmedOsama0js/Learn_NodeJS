module.exports = (io, socket, onlineUsers) => {
  try {
    if (!socket.user || !socket.user.id) {
      console.error(
        "❌ خطأ: لم يتم العثور على بيانات المستخدم أو أنها غير صحيحة"
      );
      return;
    }

    const { name, id, role } = socket.user;

    socket.on("privateTyping", ({ receiverId }) => {
      if (!receiverId || !onlineUsers[receiverId]) return;
      console.debug(`✍️ المستخدم ${name} يكتب الآن للمستخدم ID: ${receiverId}`);

      if (onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId].socketId).emit("privateTyping", {
          id,
          name,
          role,
        });
      }
    });

    socket.on("privateStoppedTyping", ({ receiverId }) => {
      if (!receiverId || !onlineUsers[receiverId]) return;
      console.debug(`🛑 ${name} توقف عن الكتابة في المحادثة الخاصة.`);

      if (onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId].socketId).emit("privateStoppedTyping", {
          id,
          name,
          role,
        });
      }
    });

    socket.on("groupTyping", ({ groupId, members }) => {
      if (!groupId.trim() || !Array.isArray(members)) return;
      console.debug(`✍️ ${name} يكتب الآن في الجروب ID: ${groupId}`);

      members.forEach((memberId) => {
        if (memberId !== id && onlineUsers[memberId]) {
          io.to(onlineUsers[memberId].socketId).emit("groupTyping", {
            id,
            name,
            role,
            groupId,
          });
        }
      });
    });

    socket.on("groupStoppedTyping", ({ groupId, members }) => {
      if (!groupId.trim() || !Array.isArray(members)) return;
      console.debug(`🛑 ${name} توقف عن الكتابة في الجروب ID: ${groupId}`);

      members.forEach((memberId) => {
        if (memberId !== id && onlineUsers[memberId]) {
          io.to(onlineUsers[memberId].socketId).emit("groupStoppedTyping", {
            id,
            name,
            role,
            groupId,
          });
        }
      });
    });
  } catch (error) {
    console.error("❌ خطأ في إدارة ميزة الكتابة:", error.message);
  }
};
