// create a new instance of an Express app
// configure the environment and middlewares
// load the views and routes

// load required modules
var express = require('express');
var morgan = require('morgan');                   // logging
var compress = require('compression');            // compress responses
var bodyParser = require('body-parser');          // parse request data
var methodOverride = require('method-override');  // support for PUT & DELETE
var session = require('express-session');         // user session support
var passport = require('passport');               // user authentication

// load our environment configuration
var config = require('./config');

module.exports = function () {
  var app = express();

  // use different middleware for dev & prod environments
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  // always use these middlewares - NB order is important
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({saveUninitialized: true,
                   resave: true,
                   secret: config.sessionSecret}));

  // set the view engine and location of the views
  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  // set up user authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // load the routes
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);

  // load the static content - NB this must be below the routes to avoid
  // filesystem I/O delays
  app.use(express.static('./public'));

  return app;
};
