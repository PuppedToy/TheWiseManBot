require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
const generate = require('./generate');
const { add } = require('./manager');

const startings = [
  'Como dijo un hombre sabio:',
  'Ya lo dijo un hombre sabio:',
];

bot.onText(/\/wisdom/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  // const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  const starting = startings.sample();
  const sentence = await generate();
  bot.sendMessage(chatId, `${starting} "${sentence}"`);
});

bot.onText(/\/add(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const [_, param] = match;
  const sentence = param.trim().replace(/\.$/, '');
  try {
    await add(
      {
        ...msg.from,
        platform: 'telegram',
      },
      sentence
    );
    bot.sendMessage(chatId, `Has registrado la frase: "${sentence}."`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Parece que ha habido un error. Prueba más tarde por favor.');
  }
});