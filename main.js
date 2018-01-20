'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Here will be our Meme Time');
});

app.listen(3000, '0.0.0.0');
