// this is a basic middleware component to be used by Express
// need to 'require' this component and then 'app.use' it

exports.render = function (req, res) {

  // add a sesison cookie
  if (req.session.lastVisit) {
    console.log(req.session.lastVisit);
  }
  req.session.lastVisit = new Date();

  // render a template page - use the app's view engine
  res.render('index', {
    title: 'Hello World'
  });
};
