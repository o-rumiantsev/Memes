'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./lib/auth.js');
const log = require('./lib/log.js');
const getMemesFromDb = require('./lib/getMemesFromDb.js');
const recieveMemesFromUser = require('./lib/recieveMemesFromUser.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Here will be our Meme Time');
});

app.post('/handleRegistationRequest', (req, res) => {
  const credentials = req.body.credentials;
  auth.register(credentials, (err, sessionId) => {
    if (err) {
      res.sendStatus(500);
      log.error(err);
    } else res.send(sessionId);
  });
});

app.post('/login', (req, res) => {
  const credentials = req.body.credentials;
  auth.enticate(credentials, (err, authenticated) => {
    if (err) {
      res.sendStatus(500);
      log.error(err);
    } else res.send(authenticated);
  });
});

app.post('/getMemes', (req, res) => {
  const sessionId = req.body.sessionId;
  if (req.body.data) recieveMemesFromUser(req, (err) => {
    if (err) log.error(err);
    else sendMemes(res, sessionId);
  });
  else sendMemes(res, sessionId);
});

app.listen(3000, '0.0.0.0');

function sendMemes(res, sessionId) {
  getMemesFromDb(sessionId, (err, memes) => {
    if (err) {
      log.error(err);
      res.status(500).end();
    } else {
      const frontMemes = memes.map(
        (meme) => ({
          _id: meme._id,
          url: meme.url
        })
      );
      res.json({ frontMemes }).end();
    }
  });
}
