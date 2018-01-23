'use strict';

const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const generateSessionId = require('./generateSessionId.js');
const url = 'mongodb://127.0.0.1:27017';


//Internal functions
//
//
const _insertMany = (db, memes, callback) => {
  const collection = db.collection('memes');
  collection.insertMany(memes, callback);
};

const _find = (db, callback) => {
  const collection = db.collection('memes');
  collection.find({}).toArray(callback);
};

const _findMeme = (db, id, callback) => {
  const collection = db.collection('memes');
  const filter = { _id: objectId(id) };
  collection.findOne(filter, callback);
};

const _update = (db, id, update, callback) => {
  const collection = db.collection('memes');
  const filter = { _id: objectId(id) };
  collection.updateOne(filter, update, callback);
};

const _remove = (db, id, callback) => {
  const collection = db.collection('memes');
  const filter = { _id: objectId(id) };
  collection.deleteOne(filter, callback);
};

const _findUser = (db, sessionId, callback) => {
  const collection = db.collection('users');
  const filter = { sessionId };
  collection.findOne(filter, callback);
};

const _updateUser = (db, sessionId, update, callback) => {
  const collection = db.collection('users');
  const filter = { sessionId };
  collection.updateOne(filter, update, callback);
};

const _authUser = (db, login, password, callback) => {
  const collection = db.collection('users');
  const filter = { login, password };
  collection.findOne(filter, callback);
};

const _updateSessionId = (db, login, sessionId, callback) => {
  const collection = db.collection('users');
  const filter = { login };
  const update = { $set: { sessionId } };
  collection.updateOne(filter, update, callback);
};

//External functions for memes
//
//
const addMemes = (memes, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _insertMany(db, memes, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};

const getMeme = (id, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _findMeme(db, id, (err, meme) => {
      callback(err, meme);
      client.close();
    });
  });
};

const getMemes = (callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _find(db, (err, memes) => {
      callback(err, memes);
      client.close();
    });
  });
};

const updateMeme = (id, update, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _update(db, id, update, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};

const removeMeme = (id, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _remove(db, id, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};

const countOfMemes = (callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    const collection = db.collection('memes');
    collection.find({}).toArray((err, res) => {
      callback(err, res.length);
      client.close();
    });
  });
};


//External functions for users
//
//
const getUser = (sessionId, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _findUser(db, sessionId, (err, user) => {
      callback(err, user);
      client.close();
    });
  });
};


const updateUser = (user, update, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    const sessionId = user.sessionId;
    _updateUser(db, sessionId, update, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};


//Authentication
//
//
const authenticate = (login, password, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _authUser(db, login, password, (err, user) => {
      if (!user) {
        callback(err);
        client.close();
      } else {
        const sessionId = generateSessionId();
        const regStatus = user.regStatus;
        callback(err, { sessionId, regStatus });
        _updateSessionId(db, login, sessionId, () => client.close());
      }
    });
  });
};

module.exports = {
  addMemes,
  getMeme,
  getMemes,
  updateMeme,
  removeMeme,
  countOfMemes,
  getUser,
  updateUser,
  authenticate
};
