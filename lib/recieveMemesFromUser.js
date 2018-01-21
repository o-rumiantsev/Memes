'use strict';

const mongo = require('./mongo.js');
const rating = require('./rating.js');

const recieveMemesFromUser = (request, callback) => {
  const sessionId = request.sessionId;
  const memesInfo = request.data;

  mongo.getUser(sessionId, (err, user) => {
    const updatedMemes = rating.calculate(user, memesInfo);
    const userUpdate = rating.updateForUser(user, updatedMemes);
    mongo.updateUser(user, userUpdate, (err) => {
      if (err) callback(err);
    });
    const memes = rating.getUserMemes(user, memesInfo);
    memes.map((meme) => {
      // TODO: implement way to count deltaRating
      //  and whether user haven't watched it yet
      const memeUpdate = rating.updateTotal(meme/*, deltaRating, newUser*/);
      mongo.updateMeme(meme._id, memeUpdate, (err) => {
        if (err) callback(err);
      });
    });
  });
};

module.exports = recieveMemesFromUser;
