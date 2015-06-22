// start an Express app using our customised version of Express as defined
// in /config/express.js

// read in the NODE_ENV variable - default to dev
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// NB load mongoose first; then other modules will be able to use the models
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000');
