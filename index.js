// Sample free courses list
const freeCourses = [
  {
    title: "JavaScript Basics for Beginners",
    url: "https://www.udemy.com/course/javascript-basics-for-beginners/?couponCode=FREE100",
    category: "Web Development"
  },
  {
    title: "Python for Absolute Beginners",
    url: "https://www.udemy.com/course/python-absolute-beginners/?couponCode=FREE100",
    category: "Programming"
  },
  {
    title: "React JS Crash Course",
    url: "https://www.udemy.com/course/reactjs-crash-course/?couponCode=FREE100",
    category: "Web Development"
  },
  {
    title: "Data Science with Python",
    url: "https://www.udemy.com/course/data-science-python/?couponCode=FREE100",
    category: "Data Science"
  }
];


const TelegramBot = require('node-telegram-bot-api');

// Replace with your Bot Token from BotFather

require('dotenv').config();
const token = process.env.BOT_TOKEN;
// Create bot with polling (simple way)
const bot = new TelegramBot(token, { polling: true });

// When user sends /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hello ${msg.from.first_name}! 👋
Welcome to CourseHunter Bot.
Send /free to get free courses.`);
});

bot.onText(/\/categories/, (msg) => {
  const chatId = msg.
chat.id;

  // Unique categories
  const categories = [...new Set(freeCourses.map(course => course.category))];

  // Build buttons for categories
  const categoryButtons = categories.map(cat => {
    return [{ text: cat, callback_data: cat }];
  });

  bot.sendMessage(chatId, "📂 Choose a course category:", {
    reply_markup: { inline_keyboard: categoryButtons }
  });
});
// Callback query Handler
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const category = callbackQuery.data;

  // Filter courses by category
  const filteredCourses = freeCourses.filter(c => c.category === category);

  // Build inline buttons for courses
  const courseButtons = filteredCourses.map(course => {
    return [{ text: course.title, url: course.url }];
  });

  bot.sendMessage(chatId, `🚀 Free courses in *${category}*:`, {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: courseButtons }
  });
});

//Free placeholder
bot.onText(/\/free/, (msg) => {
  const chatId = msg.chat.id;

  // Build inline keyboard buttons
  const buttons = freeCourses.map((course) => {
    return [
      {
        text: course.title,       // Button label
        url: course.url           // Click opens this URL
      }
    ];
  });

  // Send message with inline buttons
  bot.sendMessage(chatId, "🚀 Here are some free Udemy courses:", {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});

