'use strict';

const getMemesFromDb = require('../lib/getMemesFromDb.js');
const sessionId = 12345;

getMemesFromDb(sessionId, (err, memes) => {
  if (err) throw err;
  console.log(memes);
});
