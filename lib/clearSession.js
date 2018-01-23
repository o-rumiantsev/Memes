'use strict';

const mongo = require('./mongo.js');
const log = require('./log.js');

const clearSession = (sessionId, SESSION_DELAY) => {
  mongo.getUserLastReq(sessionId, (err, user) => {
    const now = new Date().getTime();
    const diff = now - user.lastRequest;
    console.log(diff);
    if (diff > SESSION_DELAY) {
      const update = { $set: { sessionId: null } };
      mongo.updateUser(user, update, (err) => {
        console.log('session cleared');
        if (err) log.error(err);
      });
    }
  });
};

module.exports = clearSession;
