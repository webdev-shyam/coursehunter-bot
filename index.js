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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
