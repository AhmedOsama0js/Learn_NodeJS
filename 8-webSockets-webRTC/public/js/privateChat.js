import {
  receiverId,
  messageInput,
  typing,
  socket,
  chatTitle,
  sendButton,
  messagesContainer,
  currentUserId,
  formattedDate,
} from "./globalVar.js";

// -------------- messageFunction ------------

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

// ------------ userTitle -------------------

socket.emit("getUserInfo", { receiverId }, (response) => {
  if (response.error) {
    console.error(response.error);
  } else {
    chatTitle.innerText = `الدردشة مع ${response.receiverName}`;
  }
});

// ----------------typing-------------

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim() !== "") {
    socket.emit("privateTyping", { receiverId });
  } else {
    socket.emit("privateStoppedTyping", { receiverId });
  }
});

socket.on("privateTyping", (data) => {
  typing.innerHTML = ` ${data.name} يكتب ....`;
});

socket.on("privateStoppedTyping", (data) => {
  typing.innerHTML = "";
});

// ---------------- sendPrivateMessage ----------------------
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit("privateMessage", { receiverId, message });
    messageInput.value = "";
  }
});

socket.on("receivePrivateMessage", (data) => {
  messageFunction(data);
});

socket.emit("getPrivateMessages", { receiverId }, (messages) => {
  console.log();

  messages.map((message) => {
    messageFunction(message);
  });
});
