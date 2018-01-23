'use strict';

const fs = require('fs');
const ERROR_LOG_PATH = '../logs/errors.txt';

const error = (error) => {
  const time = new Date().toString();
  const log = `${time}: ${error.message}`;
  fs.writeFileSync(ERROR_LOG_PATH, log);
};

module.exports = {
  error
};
