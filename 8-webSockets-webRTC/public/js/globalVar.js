const token = localStorage.getItem("token");
export const socket = io("http://localhost:3000", {
  auth: { token },
});
const pathSegments = window.location.pathname.split("/");

export const typing = document.getElementById("typing");
export const currentUserId = localStorage.getItem("userId");
export const messagesContainer = document.getElementById("chatMessages");
export const groupId = "globalRoom";
export const messageInput = document.getElementById("messageInput");
export const sendButton = document.getElementById("sendButton");
export const OnlineContainer = document.getElementById("onlineUsers");
export const btnEmoji = document.getElementById("btnEmoji");
export const chatTitle = document.getElementById("chatTitle");
export const emojiPicker = document.querySelector("emoji-picker");
export const receiverId = pathSegments[pathSegments.length - 1];

export const formattedDate = (d) => {
  const date = new Date(d);

  const options = {
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("ar-EG", options);
  const formattedDate = formatter.format(date);

  const parts = formattedDate.split(" ");
  const day = parts[0];
  const month = parts[1];
  const hourMinute = parts.slice(2).join(":");

  const finalDate = `${day} - ${month} ${hourMinute} `;

  return finalDate;
};
