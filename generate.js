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
const tokenize = require('./tokenize');
const applyChaos = require('./chaos');

const equivalentTokens = [
  ['un', 'el', 'al'],
  ['una', 'la'],
  ['es', 'está']
];

const irrelevantTokens = ['como'];

async function generate(min = 3, max = 7, chaos = 0) {
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

  const tokenizedSentences = tokenize(chosenSentences);
  
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

  const filteredTokenizedSentences = tokenizedSentences
    .filter((_, id) => !skip.includes(id))
    .map(sentence => 
      sentence.map(({ token }) => token).join(' ')
    )
    .join(' ');

  let chaoticTokenizedSentences = filteredTokenizedSentences;
  if (chaos === 'auto') chaoticTokenizedSentences = await applyChaos(filteredTokenizedSentences);
  else if (chaos) chaoticTokenizedSentences = await applyChaos(filteredTokenizedSentences, chaos);
  
  let result = chaoticTokenizedSentences
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