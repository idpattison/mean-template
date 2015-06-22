// load the appropriate config file for the current environment

module.exports = require('./env/' + process.env.NODE_ENV + '.js');
