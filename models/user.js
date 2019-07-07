const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  facebookId: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
