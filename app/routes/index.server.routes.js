// pick up any GET calls to root and send them to the index server controller

module.exports = function (app) {
  var index = require('../controllers/index.server.controller');
  app.get('/', index.render);
};
