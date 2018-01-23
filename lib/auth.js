'use strict';

const mongo = require('./mongo.js');
const cryptify = require('./cryptify.js');

const enticate = (credentials, callback) => {
  const login = credentials.login;
  const password = cryptify(credentials);
  mongo.authenticate(login, password, (err, authenticated) => {
    if (!authenticated) {
      const regStatus = 'user';
      callback(err, { sessionId: null, regStatus });
      return;
    } else {
      callback(err, authenticated);
      return;
    }
  });
};

module.exports = {
  enticate,
};
