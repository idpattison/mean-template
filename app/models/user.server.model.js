// define the schema for a user and the model to implement that

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  firstName: String,
  lastName: String,

  // index: create an index on this property
  // validator: email must match the regular expression
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/
  },

  // pre-defined modifier: ensure no leading & trailing spaces for username
  // index: create an index on this property and force uniqueness
  // validator: username must be present
  username: {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required'
  },

  // custom validator: ensure passwords are long enough
  password: {
    type: String,
    validate: [
      function (password) {
        return password.length >= 6;
      },
      'Password should be longer'
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},

  // validator: role must be one of the supplied values
  role: {
    type: String,
    enum: ['admin', 'owner', 'user']
  },

  // default value: default for created is the current date & time
  created: {
    type: Date,
    default: Date.now
  },

  // custom setter: if the website isn't prefixed with http(s)://, add it
  website: {
    type: String,
    set: function (url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  }

});

// virtual attribute: calculate the value for a fullname
// NB we also have to add a UserSchema.set() call to add this into the
// MongoDB to JSON conversion
UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});
UserSchema.set('toJSON', {virtuals: true});

// pre middleware - execute before saving
UserSchema.pre('save', function (next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

// custom static method: typically to define a more specific search
UserSchema.statics.findOneByUsername = function (username, callback) {
  this.findOne({username: new RegExp(username, 'i')}, callback);
};

// custom instance method: typically to perform actions on individual items
UserSchema.methods.hashPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};
UserSchema.methods.authenticate = function (password) {
  return this.password === password;
};

// finally, create the model from the Schema
mongoose.model('User', UserSchema);
