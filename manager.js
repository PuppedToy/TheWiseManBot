const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

async function getCollection(collectionName) {
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME);
  const collection = db.collection(collectionName);
  return collection;
}

async function add(author, sentence) {
  const collection = await getCollection('sentences');
  await collection.insertOne({ author, sentence });
  client.close();
}

async function addMany(author, sentences) {
  const collection = await getCollection('sentences');
  await collection.insertMany(sentences.map(sentence => ({ author, sentence })));
  client.close();
}

async function get() {
  const collection = await getCollection('sentences');
  const sentences = await collection.find({}).toArray();
  client.close();

  return sentences.map(({ sentence }) => sentence);
}

async function list() {
  const collection = await getCollection('sentences');
  const sentences = await collection.find({}).toArray();
  client.close();

  return sentences.map(({ sentence, author }) => `${sentence}${author?.username ? `. - @${author.username}` : '.'}`);
}

async function mylist(username) {
  const collection = await getCollection('sentences');
  const sentences = await collection.find({ 'author.username': username }).toArray();
  client.close();

  return sentences.map(({ sentence }) => `${sentence}.`);
}

async function removelast(username) {
  const collection = await getCollection('sentences');
  const sentences = await collection.find({ 'author.username': username }).toArray();
  const last = sentences[sentences.length-1];
  if (!last || !last._id) throw new Error('Last id is undefined');
  await collection.deleteOne({ _id: last._id });
  client.close();
  
  return last.sentence;
}

async function findBigrams(bigram) {
  const collection = await getCollection('ngrams');
  const ngrams = await collection.find({ $and: [
    { nth: 2 },
    { $or: [
      { "words.0": bigram[0] },
      { "words.1": bigram[1] },
    ] }
  ] }).toArray();
  client.close();
  
  return ngrams.map(({ words }) => words);
}

async function findTrigrams(trigram) {
  const collection = await getCollection('ngrams');
  const query = { $and: [
    { nth: 3 },
    { $and: [
      { "words.0": trigram[0] },
      { "words.1": { $not: new RegExp(`^${trigram[1]}$`) } },
      { "words.2": trigram[2] },
    ] }
  ] };
  const ngrams = await collection.find(query).toArray();
  client.close();
  
  return ngrams.map(({ words }) => words);
}

async function deleteNgrams(nth) {
  const collection = await getCollection('ngrams');
  if (!nth) {
    await collection.deleteMany();
  } else {
    await collection.deleteMany({ nth });
  }
  client.close();
}

async function addManyNgrams(ngrams, nth = 2) {
  const collection = await getCollection('ngrams');
  await collection.insertMany(ngrams.map(words => ({ words, nth })));
  client.close();
}

module.exports = {
  add,
  addMany,
  get,
  list,
  mylist,
  removelast,
  findBigrams,
  findTrigrams,
  deleteNgrams,
  addManyNgrams,
};