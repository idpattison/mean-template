// map a route to a controller

var users = require('../../app/controllers/users.server.controller');

// calls to POST /users are routed to users.create
// calls to GET /users are routed to users.list
// calls to GET /users/1 etc are routed to users.read, with the id being
// converted to a user by users.userByID and passed as req.user
// similarly, calls to PUT /users/1 are routed to users.update
// and calls to DELETE /users/1 are routed to users.delete
module.exports = function (app) {
  app.route('/users')
    .post(users.create)
    .get(users.list);

  app.route('/users/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);

  app.param('userId', users.userByID);
};
