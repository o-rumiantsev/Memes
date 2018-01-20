'use strict';

const mongo = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const insertMany = (db, memes, callback) => {
  const collection = db.collection('memes');
  collection.insertMany(memes, callback);
};

const find = (db, callback) => {
  const collection = db.collection('memes');
  collection.find({}).toArray(callback);
};

const addMemes = (memes, callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    insertMany(db, memes, (err, result) => {
      callback(err, result);
      client.close();
    });
  });
};

const getMemes = (callback) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('memes');
    find(db, (err, memes) => {
      callback(err, memes);
      client.close();
    });
  });
};

module.exports = {
  getMemes,
  addMemes
}
