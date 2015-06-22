var User = require('mongoose').model('User');

// the create function will create a new User based on the content of the request
exports.create = function (req, res, next) {
  var user = new User(req.body);

  user.save(function (err) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

// the list function will return a list of all Users
exports.list = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};

// the read function will return a single User based on an ID
exports.read = function (req, res) {
  res.json(req.user);
};

// the userByID function will populate the req with the user based on the param
exports.userByID = function (req, res, next, id) {
  User.findOne({
    _id: id
  }, function (err, user) {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

// the update function will update a specific User with the passed ID
exports.update = function (req, res, next) {
  User.findByIdAndUpdate(req.user.id, req.body, function (err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

// the delete function will delete a specific User with the passed ID
exports.delete = function (req, res, next) {
  req.user.remove(function (err) {
    if (err) {
      return next(err);
    } else {
      res.json(req.user);
    }
  });
};
