'use strict';

const express = require('express');
const bodyParser = require('body-parser');
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


app.post('/getMemes', (req, res) => {
  console.log(req.body);
  const sessionId = req.body.sessionId;
  recieveMemesFromUser(req, (err) => {
    if (err) res.send(err);
    else sendMemes(res, sessionId);
  });
});

app.listen(3000, '0.0.0.0');

function sendMemes(res, sessionId) {
  getMemesFromDb(sessionId, (err, memes) => {
    if (err) res.status(500).send(err).end();
    else {
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
