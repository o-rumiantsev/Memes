'use strict';

const mongo = require('./mongo.js');
const downloadMemes = require('./downloadMemes.js');

const parseMemes = (memes) => {
  memes.forEach((meme) => {
    delete meme.width;
    delete meme.height;
    meme.rating = 0;
    meme.usersWatched = 0;
  });
};

const updateDb = (callback) => {
  downloadMemes((memes) => {
    parseMemes(memes);
    mongo.addMemes(memes, callback);
  });
};

updateDb((err) => console.log(err));
module.exports = updateDb;
