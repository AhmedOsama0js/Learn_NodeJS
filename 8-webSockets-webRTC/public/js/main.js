import {
  btnEmoji,
  emojiPicker,
  OnlineContainer,
  currentUserId,
  socket,
  messageInput,
} from "./globalVar.js";

socket.on("connect", () => {
  console.log("متصل بالسيرفر");
});

socket.on("connect_error", (err) => {
  console.error("خطأ في الاتصال بـ Socket.IO:", err);
});

socket.on("userId", (data) => {
  localStorage.setItem("userId", data.userId);
});

// ------------------------
function renderOnlineUsers(users) {
  OnlineContainer.innerHTML = "";

  users.forEach((user) => {
    const avatarUrl = user.avatar || `https://i.pravatar.cc/50?u=${user.id}`;

    const userElement = document.createElement("div");
    userElement.className = "online-user-card text-decoration-none";
    userElement.setAttribute("data-user-id", user.id); // تعيين ID المستخدم

    userElement.innerHTML = `
        <div class="avatar">
            <img src="${avatarUrl}" alt="Avatar of ${user.name}" />
        </div>
        <div class="user-info">
            <div class="name">${user.name}</div>
            <div class="role">الرتبة: ${user.role}</div>
            <div class="age">السن: ${user.age}</div>
        </div>
    `;

    if (currentUserId !== user.id) {
      userElement.addEventListener("click", () => {
        window.location.href = `/privateChat/${user.id}`;
      });
    } else {
      userElement.style.cursor = "default";
      userElement.style.border = "1px solid #5865f2";
      userElement.style.opacity = "50%";
    }

    OnlineContainer.appendChild(userElement);
  });
}

// ------------------------
socket.on("updateOnlineUsers", (users) => {
  renderOnlineUsers(users);
});

// -------------------------emoji-----------------

if (btnEmoji && emojiPicker && messageInput) {
  btnEmoji.addEventListener("click", function () {
    emojiPicker.classList.toggle("hidden");
  });

  emojiPicker.addEventListener("emoji-click", (event) => {
    if (messageInput) {
      messageInput.value = (
        messageInput.value +
        " " +
        event.detail.unicode
      ).trim();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !emojiPicker.contains(event.target) &&
      !btnEmoji.contains(event.target)
    ) {
      emojiPicker.classList.add("hidden");
    }
  });
}
