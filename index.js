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
  console.log(msg);
  bot.sendMessage(msg.chat.id, `Привіт ${msg.from.first_name}, давай розпочнемо:`,{
    reply_markup: {
      keyboard: [["Зареєструватися"],["Увійти"]],
      }
  });
});
bot.on('text',(msg) =>{
    switch(true){
      case msg.text === "Зареєструватися":
        bot.sendMessage(msg.chat.id,"Введіть своє ім'я")
        startRegister(1);
        break;
      case msg.text === "Увійти":
        bot.sendMessage(msg.chat.id,"Поки в розробці");
        break;
    }
});

 function startRegister(count){
  
  bot.on('message',async (msg) => {
    let chatId = msg.chat.id
    let message = msg.text
    let registrationStaps = [];
     if (count === 4) {
      return;
     }
    switch (count) {
      case 1:
        registrationStaps.name = message;
        bot.sendMessage(chatId, 'Дякую! Тепер введіть свій номер телефону:');
        break;
      case 2:
        registrationStaps.phone = message;
        bot.sendMessage(chatId, 'Дякую! Тепер придумайте пароль:');
        break;
      case 3:
        registrationStaps.password = message;
        const { name, phone, password } = registrationStaps;
        const user = new User({ name, phone, password });
        await user.save((err) => {
          if (err) {
            bot.sendMessage(chatId, 'Під час реєстрації сталася помилка. Будь ласка, спробуйте знову.');
          } else {
            bot.sendMessage(chatId, 'Ви успішно зареєстровані!');
          }
          delete registrationStaps[chatId];
        });       
       break;
    };
    startRegister(count+1);
  });
}