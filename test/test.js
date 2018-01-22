'use strict';

const getMemesFromDb = require('../lib/getMemesFromDb.js');
const recieveMemesFromUser = require('../lib/recieveMemesFromUser.js');

const req = {
  body: {
    sessionId: '12345',
    data: [
      { _id: '5a6656c88a9c534d590b2f2a', clicked: true },
      { _id: '5a6656c88a9c534d590b2f26', clicked: false }
    ]
  }
};

const sendMemes = (sessionId) => {
  getMemesFromDb(sessionId, (err, memes) => {
    if (err) {
      console.error(err);
      // res.status(500).end();
    } else {
      const frontMemes = memes.map(
        (meme) => ({
          _id: meme._id,
          url: meme.url
        })
      );
      console.log(frontMemes);
      // res.json({ frontMemes }).end();
    }
  });
};

const appPost = (req) => {
  const sessionId = req.body.sessionId;
  recieveMemesFromUser(req, (err) => {
    if (err) console.error(err);
    else sendMemes(sessionId);
  });
};

appPost(req);
