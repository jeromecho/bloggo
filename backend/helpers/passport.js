const passport = require('passport');
const bcrypt = require('bcryptjs');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

// * username, password -> compares it with user's credentials on db -> returns 
//   an error, or, the USER on the db themself if the credentials match
passport.use(new LocalStrategy (function (username, password, done) {
    User.findOne({ username }).exec((err, user) => {
        if (err) { return done(err) }
        else if (!user) { return done(null, false, { message: "User not found!" }) }
        else {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) { return done(err) }
                if (res) {
                    return done(null, user);
                } 
                return done(null, false, { message: "Incorrect password" });
            });
        }
    })
}));

 passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.JWT_SECRET, 
}, (jwtPayload,  done) => {
    User.findById(jwtPayload._id).exec((err, user) => {
        if (err) { done(err) }
        if (!user) { done(null, false, { message: "User not found" })}
        done(null, user);
    });
}));

module.exports = passport;
