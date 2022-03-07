Array.prototype.sample = require('array-sample');
Array.prototype.weighedSample = function(weight = 0.5, reversed = false) {
  if (this.length < 1) {
    return undefined;
  }

  if (!reversed) {
    for (let element = 0; element < this.length; element += 1) {
      if (Math.random() < weight) {
        return this[element]
      }
    }
  }
  else {
    for (let element = this.length-1; element >= 0; element -= 1) {
      if (Math.random() < weight) {
        return this[element]
      }
    }
  }

  return this[this.length-1];
}
const { get } = require('./manager');

const equivalentTokens = [
  ['un', 'el', 'al'],
  ['una', 'la'],
  ['es', 'está']
];

const irrelevantTokens = ['como'];

async function generate(min = 3, max = 7) {
  const sentences = await get();
  const amountSentences = parseInt(Math.random()*(max-min+1)+min);
  const chosenSentences = [];
  for(let i = 0; i < amountSentences; i++) {
    let nextSentence;
    do {
      nextSentence = sentences.sample();
    } while(chosenSentences.includes(nextSentence));
    chosenSentences.push(nextSentence);
  }

  const tokenizedSentences = chosenSentences.map(sentence => {
    const sentenceTokensParsed = sentence.toLowerCase()
      .replace(/([^a-záéíóúüñ"' ]+)/gi, ' $1 ')
      .replace(/ {2,}/g, ' ');
    const sentenceTokens = sentenceTokensParsed.split(' ');
    return sentenceTokens.map((token, id) => ({
      id,
      token,
      joints: [],
    }));
  });

  const graph = [];

  tokenizedSentences.forEach((tokens, id) => {
    tokens.forEach((currentToken) => {
      tokenizedSentences.forEach((targetTokens, targetId) => {
        if (targetId !== id) {
          targetTokens.forEach(({ token }, tokenId) => {
            if (token === currentToken.token) {
              currentToken.joints.push([targetId, tokenId]);
              if (!graph[id]) {
                graph[id] = [];
              }
              if (!graph[id].includes(targetId)) {
                graph[id].push(targetId);
              }
            }
          });
        }
      });
    });
  });
  
  let skip = [];
  let jump = 1;
  for (let i = 0; i < tokenizedSentences.length - jump; i++) {
    if (skip.includes(i)) continue;
    const jointFilter = joint => joint[0] === i + jump;
    let currentSentence = tokenizedSentences[i];
    const tokensToNext = currentSentence
      .filter(({ joints }) => joints.some(jointFilter));
    if (tokensToNext.length) {
      const chosenToken = tokensToNext.weighedSample();
      const filteredJoints = chosenToken.joints.filter(jointFilter);
      const chosenJoint = i < tokenizedSentences.length - jump - 1 ? 
        filteredJoints.sample() : filteredJoints.weighedSample(0.5, true);
      currentSentence.splice(chosenToken.id + 1, currentSentence.length);
      tokenizedSentences[i + jump].splice(0, chosenJoint[1] + 1);
      tokenizedSentences[i + jump].forEach((token, id) => {
        token.id = id;
      });
      jump = 1;
    }
    else {
      skip.push(i + jump);
      i -= 1;
      jump += 1;
    }
  }

  let result = tokenizedSentences
    .filter((_, id) => !skip.includes(id))
    .map(sentence => 
      sentence.map(({ token }) => token).join(' ')
    )
    .join(' ')
    .split(' . ')
    .map((sentence) => {
      return `${sentence[0].toUpperCase()}${sentence.substr(1)}`
    })
    .join(' . ')
    .replace(/ ([^a-záéíóúüñ"' ]) /gi, '$1 ')
    .replace(/(?<=^|[,.!?:;]) ([^,.!?:;]*?)!/gi, ' ¡$1!')
    .replace(/(?<=^|[,.!?:;]) ([^,.!?:;]*?)\?/gi, ' ¿$1?');

  return `${result}.`;
}

module.exports = generate;