import TelegramBot from "node-telegram-bot-api";

const token = '6294387182:AAHiGAbPts-nA00qJ9MngoHeYTQp2di4gJQ';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Давайте почнемо:",{
    "reply_markup": {
      "keyboard": [["Зареєструватися"], ["Авторизуватися"]]
      }
  });
});
bot.on('message', (msg) => {
  const messageText = msg.text;
  switch (true) {
    case messageText === 'Зареєструватися':
      bot.sendMessage(msg.chat.id, "Ви натиснули зареєструватися",{
        "reply_markup": {
          remove_keyboard:true
          }
      })
      break;
    case messageText === 'Авторизуватися':
      bot.sendMessage(msg.chat.id, "Ви натиснули Авторизуватися",{
        "reply_markup": {
          remove_keyboard:true
          }
      })
      break;
  }
});