'use strict';

const mongo = require('./mongo.js');
const MAX_VIEWS = 10;
const CACHE_TIMEOUT = 3000000;

let counter = 0;
const chosenMemes = [];
if (!global.cachedIndexes) global.cachedIndexes = new Set();
const cache = global.cachedIndexes;

const randomize = (max) => {
  const res = Math.floor(Math.random() * max);
  if (cache.has(res)) randomize(max);
  else {
    cache.add(res);
    setTimeout(() => {
      cache.delete(res);
    }, CACHE_TIMEOUT);
  }
  return res;
};


const getMemesFromDb = (sessionId, callback) => {
  mongo.countOfMemes((err, count) => {
    if (err) {
      callback(err);
      return;
    }
    mongo.getUser(sessionId, (err, user) => {
      if (err) {
        callback(err);
        return;
      }
      mongo.getMemes((err, memes) => {
        const generateMeme = () => {
          const index = randomize(count);
          let chosenMeme = memes[index];
          user.memes.forEach((meme) => {
            if (meme.url === chosenMeme.url) {
              chosenMeme = meme;
              return;
            }
          });

          if (chosenMeme.views && chosenMeme.views > MAX_VIEWS) {
            generateMeme();
            return;
          }

          if (counter === 2) {
            callback(null, chosenMemes);
            return;
          } else {
            chosenMemes.push(chosenMeme);
            ++counter;
            generateMeme();
            return;
          }
        };

        generateMeme();
      });
    });
  });
};

module.exports = getMemesFromDb;
