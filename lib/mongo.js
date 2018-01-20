'use strict';

const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
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
  collection.findOne({ sessionId }, callback);
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
    _findUser(db, sessionId, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};


module.exports = {
  getMemes,
  addMemes,
  updateMeme,
  removeMeme,
  countOfMemes,
  getUser
};