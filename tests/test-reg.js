'use strict';

const auth = require('../lib/auth.js');
const log = require('../lib/log.js');

const req = {
  body: {
    credentials: {
      login: 'Maksim',
      password: '1111'
    }
  }
};


const appPost = (req) => {
  const credentials = req.body.credentials;
  auth.register(credentials, (err, sessionId) => {
    if (err) {
      // res.sendStatus(500);
      log.error(err);
    } else  console.log(sessionId); //res.send(authenticated);
  });
};

appPost(req);
