const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
    clientID: '474776526269-ik1ci3l9r6iso0ngqtf33q24gk5hsll4.apps.googleusercontent.com',
    clientSecret: 'IfNqsM2oTGogyK-yn0AhXsKG',
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({googleId: profile.id}, (err, user) => {
      if (!user) {
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        newUser.save()
              .then(user => {
                done(null, newUser);
                console.log('Successful create');
                // res.redirect('/users/login');
              })
              .catch(err => console.log(err));
      } else {
        console.log('Existing');
      }
    })
  }
));
};
