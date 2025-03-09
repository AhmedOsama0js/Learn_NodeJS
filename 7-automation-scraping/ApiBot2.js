const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

const sendMessageInTelegram = () => {
  setInterval(() => {
    bot.sendMessage(
      chatId,
      "🔔 تذكير تلقائي! هذه رسالة يتم إرسالها كل دقيقة ⏰"
    );
    console.log("📨 تم إرسال الإشعار في تيليجرام.");
  }, 1000);
};

module.exports = { sendMessageInTelegram };
