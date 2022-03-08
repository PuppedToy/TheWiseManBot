const { findBigrams } = require('./manager');
Array.prototype.sample = require('array-sample');

async function swapBigram(tokens) {
    const bigramIndex = parseInt(Math.random() * tokens.length-1, 10);
    const bigram = [tokens[bigramIndex], tokens[bigramIndex + 1]];
    const bigramsFound = await findBigrams(bigram);
    if (!bigramsFound || bigramsFound.length === 0) return tokens;
    const resultBigram = bigramsFound.sample();
    const result = [...tokens];
    result[bigramIndex] = resultBigram[0];
    result[bigramIndex + 1] = resultBigram[1];
    return result;
}

async function applyChaos(sentence, chaos = 'auto') {
    let tokens = sentence.split(' ');
    const chaosLevel = chaos === 'auto' ? parseInt(tokens.length/3, 10) : chaos;
    for(let i = 0; i < chaosLevel; i++) {
        tokens = await swapBigram(tokens);
    }
    return tokens.join(' ');
}

module.exports = applyChaos;