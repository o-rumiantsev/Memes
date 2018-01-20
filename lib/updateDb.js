'use strict';

const downloadMemes = require('./downloadMemes.js');

downloadMemes((memes) => {
  console.log(memes);
});
