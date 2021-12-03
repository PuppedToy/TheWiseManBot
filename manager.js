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
  console.log('add');
  const collection = await getCollection('sentences');
  await collection.insertOne({ author, sentence });
  client.close();
}

async function addMany(author, sentences) {
  console.log('addMany');
  const collection = await getCollection('sentences');
  await collection.insertMany(sentences.map(sentence => ({ author, sentence })));
  client.close();
}

async function get() {
  console.log('get');
  const collection = await getCollection('sentences');
  const sentences = await collection.find({}).toArray();
  client.close();

  return sentences.map(({ sentence }) => sentence);
}

module.exports = {
  add,
  addMany,
  get,
};