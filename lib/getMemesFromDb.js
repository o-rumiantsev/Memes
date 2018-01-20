'use strict';

const mongo = require('./mongo.js');
const MAX_VIEWS = 10;
const CACHE_TIMEOUT = 3000000;

let counter = 0;
const chosenMemes = [];
const cachedIndexes = new Set();

const randomize = (max) => {
  const res = Math.floor(Math.random() * max);
  if (cachedIndexes.has(res)) randomize(max);
  else {
    cachedIndexes.add(res);
    setTimeout(() => {
      cachedIndexes.delete(res);
    }, CACHE_TIMEOUT).unref();
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
            callback(null, chosenMeme);
            return;
          } else {
            chosenMemes.push(chosenMeme);
            ++counter;
            generateMeme();
            return;
          }
        };
      });
    });
  });
};

module.exports = getMemesFromDb;
