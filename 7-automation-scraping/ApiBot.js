require("dotenv").config();
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("✅ بوت تيليجرام يعمل الآن...");

const usersFile = "users.json";

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch (error) {
    return {};
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const sendWelcomeMessage = async (chatId, firstName) => {
  try {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📚 قائمة الدروس", callback_data: "lessons" }],
          [{ text: "🔍 البحث", callback_data: "search" }],
        ],
      },
    };

    await bot.sendMessage(
      chatId,
      `مرحبًا ${firstName}! 😊\nكيف يمكنني مساعدتك؟`,
      options
    );
  } catch (error) {
    console.error(`❌ خطأ أثناء إرسال الرسالة: ${error.message}`);
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();
  const firstName = msg.from.first_name || "مستخدم";

  let users = loadUsers();

  // 📌 حفظ المستخدم في قاعدة البيانات (ملف JSON)
  if (!users[chatId]) {
    users[chatId] = { firstName, lastMessage: new Date().toISOString() };
    saveUsers(users);
  }

  if (text === "/start") {
    await sendWelcomeMessage(chatId, firstName);
  } else if (text === "/help") {
    await bot.sendMessage(
      chatId,
      "📜 قائمة الأوامر:\n/start - بدء البوت\n/help - عرض المساعدة"
    );
  } else {
    await bot.sendMessage(
      chatId,
      `🤖 لا أفهم هذا الأمر، لكنني أتعلم! جرب /help.`
    );
  }
});

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "lessons") {
    await bot.sendMessage(
      chatId,
      "📖 إليك قائمة الدروس:\n1️⃣ مقدمة في البرمجة\n2️⃣ تعلم JavaScript\n3️⃣ تطوير الويب"
    );
  } else if (data === "search") {
    await bot.sendMessage(chatId, "🔎 ماذا تريد أن تبحث عنه؟");
  }

  // تأكيد استلام الضغط على الزر
  await bot.answerCallbackQuery(callbackQuery.id);
});
