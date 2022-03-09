const { findBigrams, findTrigrams } = require('./manager');
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

async function swapTrigram(tokens) {
    const trigramIndex = parseInt(Math.random() * tokens.length - 2, 10);
    const trigram = [tokens[trigramIndex], tokens[trigramIndex + 1], tokens[trigramIndex + 2]];
    const trigramsFound = await findTrigrams(trigram);
    if (!trigramsFound || trigramsFound.length === 0) {
        return null;
    }
    const resultTrigram = trigramsFound.sample();
    const result = [...tokens];
    result[trigramIndex] = resultTrigram[0];
    result[trigramIndex + 1] = resultTrigram[1];
    result[trigramIndex + 2] = resultTrigram[2];
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

async function applySoftChaos(sentence, chaos = 'auto') {
    let tokens = sentence.split(' ');
    let chaosLevel = chaos === 'auto' ? parseInt(tokens.length/3, 10) : chaos;
    for(let i = 0; i < 500 && chaosLevel > 0; i++) {
        const result = await swapTrigram(tokens);
        if (result) {
            tokens = result;
            chaosLevel -= 1;
        }
    }
    return tokens.join(' ');
}

module.exports = { applyChaos, applySoftChaos };