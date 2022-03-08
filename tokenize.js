module.exports = function(chosenSentences, joints = true) {
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

    if (joints) {
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
    }

    return tokenizedSentences;
}