require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});
const generate = require('./generate');
const { add, list, mylist, removelast } = require('./manager');

const startings = [
  'Como dijo un hombre sabio:',
  'Ya lo dijo un hombre sabio:',
];

bot.onText(/\/wisdom/, async (msg) => {
  const chatId = msg.chat.id;

  const starting = startings.sample();
  try {
    const sentence = await generate();
    bot.sendMessage(chatId, `${starting} "${sentence}"`);
  }
  catch (error) {
    bot.sendMessage(chatId, 'Parece que ha habido un error. Prueba más tarde por favor.');
  }
});

bot.onText(/\/insight/, async (msg) => {
  const chatId = msg.chat.id;

  const starting = startings.sample();
  try {
    const sentence = await generate(3, 3);
    bot.sendMessage(chatId, `${starting} "${sentence}"`);
  }
  catch (error) {
    bot.sendMessage(chatId, 'Parece que ha habido un error. Prueba más tarde por favor.');
  }
});

bot.onText(/\/add(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const [_, param] = match;
  const sentence = param.trim().replace(/(^"|"$)/g, '').replace(/\.$/, '').replace(/[¡¿]/g, '');
  if (!sentence) {
    bot.sendMessage(chatId, 'Por favor, escribe la frase que quieres enviar. Por ejemplo:\n/add Esto es una frase de sabio.');
    return;
  }
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


bot.onText(/\/removelast/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const deleted = await removelast(msg.from.username);
    bot.sendMessage(chatId, `Has borrado la frase: "${deleted}."`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Parece que ha habido un error. Prueba más tarde por favor.');
  }
});

bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id;
  const sentences = await list();
  if (!sentences.length) {
    bot.sendMessage(chatId, 'No existe ninguna frase. Utiliza el comando /add para añadir nuevas frases.');
  }
  const preparedList = sentences.map((item, id) => `${id + 1}. ${item}`);
  for(let i = 0; i < preparedList.length; i += 5) {
    await bot.sendMessage(chatId, preparedList.slice(i, i + 5).join('\n'));
  }
});

bot.onText(/\/mylist/, async (msg) => {
  const chatId = msg.chat.id;
  const sentences = await mylist(msg.from.username);
  if (!sentences.length) {
    bot.sendMediaGroup(chatId, 'No existe ninguna frase a tu nombre. Utiliza el comando /add para añadir nuevas frases');
  }
  const preparedList = sentences.map((item, id) => `${id + 1}. ${item}`);
  for(let i = 0; i < preparedList.length; i += 5) {
    await bot.sendMessage(chatId, preparedList.slice(i, i + 5).join('\n'));
  }
});