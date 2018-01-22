'use strict';

const express = require('express');
const getMemesFromDb = require('./lib/getMemesFromDb.js');
const recieveMemesFromUser = require('./lib/recieveMemesFromUser.js');
const app = express();

app.get('/', (req, res) => {
  res.send('Here will be our Meme Time');
});

app.post('/getMemes', (req, res) => {
  const sessionId = req.body.sessionId;
  if (!req.data) getMemesFromDb(sessionId, (err, memes) => {
    if (err) res.send(err);
    else res.send(memes);
  });
  else recieveMemesFromUser(req, (err) => {
    if (err) res.send(err);
  });
});

app.listen(3000, '0.0.0.0');
