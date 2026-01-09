require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// Token from environment variable
const token = process.env.BOT_TOKEN;

// Create bot WITHOUT polling
const bot = new TelegramBot(token);

// Webhook route (Telegram will send updates here)
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Basic test route (for browser)
app.get('/', (req, res) => {
  res.send('CourseHunter Bot is running 🚀');
});

// Bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Hello ${msg.from.first_name}! 👋
Welcome to CourseHunter Bot.
Send /free to get free courses.`
  );
});

bot.onText(/\/free/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Free courses coming soon 🎯');
});

const axios = require("axios");

// /free command → show categories
bot.onText(/\/free/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose a category:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Programming", callback_data: "cat_programming" }],
        [{ text: "Design", callback_data: "cat_design" }],
        [{ text: "Marketing", callback_data: "cat_marketing" }],
      ],
    },
  });
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "cat_programming") {
    // Show discount options for Programming
    bot.sendMessage(chatId, "Choose discount:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "100% Free", callback_data: "discount_100_programming" }],
          [{ text: "75% Off", callback_data: "discount_75_programming" }],
        ],
      },
    });
  }

  // Add more categories here later
});

// Fetching Courses form API

if (data === "discount_100_programming") {
  bot.sendMessage(chatId, "Fetching 100% free Programming courses... 🚀");

  try {
    const response = await axios.get(
      "https://www.udemyfreebiesapi.com/api/courses?category=programming"
    );

    const courses = response.data.filter(
      (c) => c.discount_percent === 100
    );

    if (courses.length === 0) {
      bot.sendMessage(chatId, "No free Programming courses found 😢");
    } else {
      courses.slice(0, 10).forEach((course, index) => {
        bot.sendMessage(
          chatId,
          `${index + 1}. ${course.title} – ${course.discount_percent}% Off\n${course.url}`
        );
      });
    }
  } catch (error) {
    bot.sendMessage(chatId, "Error fetching courses 😢");
    console.error(error);
  }
}


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
