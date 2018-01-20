'use strict';

const memes = require('./memes.js');
const downloadMemes = require('./downloadMemes.js');

const parseMemes = (memes) => {
  memes.forEach((meme) => {
    delete meme.width;
    delete meme.height;
    // TODO: meme properies
  });
};

const updateDb = (callback) => {
  downloadMemes((memesArray) => {
    parseMemes(memesArray);
    memes.addMemes(memesArray, callback);
  });
};

module.exports = updateDb;
