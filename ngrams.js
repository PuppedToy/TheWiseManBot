require('dotenv').config();
const { get, deleteNgrams, addManyNgrams } = require('./manager');
const tokenize = require('./tokenize');

async function ngramAll() {
    const sentences = await get();
    await deleteNgrams();
    const tokenizedSentences = tokenize(sentences, false);
    const bigrams = [];
    const trigrams = [];
    tokenizedSentences.forEach(sentence => {
        for(let i = 0; i < sentence.length - 1; i++) {
            bigrams.push([ sentence[i].token, sentence[i + 1].token ]);
            if (i < sentence.length - 2) {
                trigrams.push([ sentence[i].token, sentence[i + 1].token, sentence[i + 2].token ])
            }
        }
    });
    await addManyNgrams(bigrams, 2);
    await addManyNgrams(trigrams, 3);
}

ngramAll();