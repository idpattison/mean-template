// get the mongodb connection data from the config file and attach it to mongoose

var config = require('./config');
var mongoose = require('mongoose');

module.exports = function () {
  var db = mongoose.connect(config.db);

  // register the models we want to use
  require('../app/models/user.server.model');

  return db;
};
