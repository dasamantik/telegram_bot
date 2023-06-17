import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js"


dotenv.config();
await mongoose
  .connect(process.env.DB)
  .then(() => console.log("DB coneccted"))
  .catch((err) => console.log("DB error", err));
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

bot.setMyCommands([
  {command:"/start",description:"Розпочати роботу з ботом"}
])

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привіт ${msg.from.first_name}, давай розпочнемо:`,{
    reply_markup: {
      keyboard: [["Зареєструватися"],["Увійти"]],
      }
  });
});
bot.on('text',(msg) =>{
    switch(true){
      case msg.text === "Зареєструватися":
        const registerdata = {};
        bot.sendMessage(msg.chat.id,"Введіть своє ім'я")
        startRegister(msg.chat.id, 1,registerdata);
        break;
      case msg.text === "Увійти":
        bot.sendMessage(msg.chat.id,"Поки в розробці");
        break;
    }
});

function startRegister(chatId, count,registerdata) {
  switch (count) {
    case 1:
      bot.on('message', async (msg) => {
          registerdata.name = msg.text;
          bot.sendMessage(chatId, 'Дякую! Тепер введіть свій номер телефону:');
          bot.removeListener('message');
          startRegister(chatId, count + 1,registerdata);
      });
      break;
    case 2:
      bot.on('message', async (msg) => {
          registerdata.email = msg.text;
          bot.sendMessage(chatId, 'Дякую! Тепер придумайте пароль:');
          bot.removeListener('message');
          startRegister(chatId, count + 1,registerdata);
      });
      break;
    case 3:
      bot.on('message', async (msg) => {
          registerdata.password = msg.text;
          console.log(registerdata);
          const {name,email,password} = registerdata;
          const user = new User({ name, email, password });
          await user.save();
          bot.sendMessage(chatId, 'Ви успішно зареєстровані!');
          bot.removeListener('message');
      });
      break;
  }
}