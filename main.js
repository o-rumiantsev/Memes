'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./lib/auth.js');
const log = require('./lib/log.js');
const getMemesStats = require('./lib/getMemesStats.js');
const getMemesFromDb = require('./lib/getMemesFromDb.js');
const recieveMemesFromUser = require('./lib/recieveMemesFromUser.js');
const clearSession = require('./lib/clearSession.js');
const SESSION_DELAY = 1800000;

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



app.get('/getMemesStats', (req, res) => {
  getMemesStats((err, memes) => {
    if (err) {
      res.sendStatus(500);
      log.error(err);
    } else res.json({ memes });
  });
});



app.post('/handleRegistation', (req, res) => {
  const credentials = req.body.credentials;
  auth.register(credentials, (err, sessionId) => {
    if (err) {
      res.sendStatus(500);
      log.error(err);
    } else {
      res.send(sessionId);
      setTimeout(() => clearSession(sessionId), SESSION_DELAY);
    }
  });
});



app.post('/login', (req, res) => {
  const credentials = req.body.credentials;
  auth.enticate(credentials, (err, authenticated) => {
    if (err) {
      res.sendStatus(500);
      log.error(err);
    } else {
      res.json({ authenticated });
      setTimeout(() => clearSession(authenticated.sessionId), SESSION_DELAY);
    }
  });
});



app.post('/getMemes', (req, res) => {
  const sessionId = req.body.sessionId;
  if (req.body.data) recieveMemesFromUser(req, (err) => {
    if (err) log.error(err);
    else sendMemes(res, sessionId);
  });
  else sendMemes(res, sessionId);
  setTimeout(() => clearSession(sessionId), SESSION_DELAY);
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
