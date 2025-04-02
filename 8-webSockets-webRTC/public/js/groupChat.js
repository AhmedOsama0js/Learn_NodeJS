import {
  typing,
  messagesContainer,
  messageInput,
  sendButton,
  socket,
  currentUserId,
  groupId,
  formattedDate,
} from "./globalVar.js";

//-------------------------- messageFunction ---------------------

const messageFunction = (data) => {
  const { sender, content, timestamp, senderName } = data;

  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if ((sender?._id || sender) === currentUserId) {
    messageElement.classList.add("my-message");
  } else {
    messageElement.classList.add("other-message");
  }

  messageElement.innerHTML = `
    <div class="message-content">
      <div class="message-header">
        <img class="message-avatar" src="https://i.pravatar.cc/50?u=${
          sender?._id || sender
        }" alt="Avatar">
        <span class="message-name">${sender.name || senderName}</span>
        <span class="message-time">${formattedDate(timestamp)}</span>
      </div>
      <div class="message-text">${content}</div>
    </div>
  `;

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  typing.innerHTML = "";
};

// -------------notificationOnline----------------------
function showToast(message, type = "primary", user = {}) {
  const toastContainer = document.getElementById("toastContainer");

  const avatarUrl = `https://i.pravatar.cc/40?u=${user.id || Math.random()}`;

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
                <img src="${avatarUrl}" class="rounded-circle" width="30" height="30" alt="${
    user.name || ""
  }">
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();

  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

socket.on("newUserConnected", (user) => {
  showToast(`${user.name} (${user.role}) دخل إلى التطبيق`, "success", user);
});

socket.on("userDisconnected", (user) => {
  showToast(`${user.name} خرج من التطبيق`, "danger", user);
});

// ------------------- typing ----------------------

let members = [];

socket.on("updateOnlineUsers", (users) => {
  members = users.map((user) => user.id);
});

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim() !== "") {
    socket.emit("groupTyping", { groupId, members });
  } else {
    socket.emit("groupStoppedTyping", { groupId, members });
  }
});

socket.on("groupTyping", (data) => {
  typing.innerHTML = ` ${data.name} يكتب ....`;
});

socket.on("groupStoppedTyping", (data) => {
  typing.innerHTML = "";
});

// ----------- message ------------------------

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("sendMessage", { message });
    messageInput.value = "";
  }
});

socket.on("receiveGroupMessage", (data) => {
  messageFunction(data);
});

socket.emit("getGroupMessages", (messages) => {
  messages.map((message) => {
    messageFunction(message);
  });
});
