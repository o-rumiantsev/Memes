'use strict';

const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
  const filter = { _id: ObjectId(id) };
  collection.updateOne(filter, update, callback);
};

const _remove = (db, id, callback) => {
  const collection = db.collection('memes');
  const filter = { _id: ObjectId(id) };
  collection.deleteOne(filter, callback);
};


//External functions
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
    })
  });
};

const removeMeme = (id, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    _remove(db, id, (err, result) => {
      callback(err, result);
      client.close();
    })
  });
};

module.exports = {
  getMemes,
  addMemes,
  updateMeme,
  removeMeme
};
