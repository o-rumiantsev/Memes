'use strict';

const mongo = require('./mongo.js');
const downloadMemes = require('./downloadMemes.js');

const parseMemes = (memes) => {
  memes.forEach((meme) => {
    delete meme.width;
    delete meme.height;
    meme.rate = 0;
    meme.usersWatched = 0;
    // TODO: meme properies
  });
};

const updateDb = (callback) => {
  downloadMemes((memes) => {
    parseMemes(memes);
    mongo.addMemes(memes, callback);
  });
};

module.exports = updateDb;
