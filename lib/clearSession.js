'use strict';

const mongo = require('./mongo.js');
const log = require('./log.js');
const SESSION_DELAY = 1800000;

const clearSession = (sessionId) => {
  mongo.getUserLastReq(sessionId, (err, user) => {
    const now = new Date().getTime();
    const diff = now - user.lastRequest;
    if (diff > SESSION_DELAY) {
      const update = { $set: { sessionId: null } };
      mongo.updateUser(user, update, (err) => log.error(err));
    }
  });
};

module.exports = clearSession;
