const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

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
    User.findById(jwtPayload).exec((err, user) => {
        if (err) { done(err) }
        if (!user) { done(null, false, { message: "User not found" })}
        done(null, user);
    });
}));

exports.login_user = (req, res, next) => {
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (!user || err) { return next(err) }
        if (info) { 
            return next();
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json(token);
    })(req, res);
    // passport.authenticate RETURNS a middleware function. Middleware functions 
    // by default take the arguments (req, res, next) -> this means that 
    // req, res, next references inside the body of the returned middleware function 
    // are BASED ON THE PARAMETERS, and not provided by closure. By not calling 
    // the returned middleware function and not passing it req and res explictly
    // the values of req and res in the middleware function returned by 
    // passport.authenticate is null!
};


exports.signup_user = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
            name: req.body.name, 
            username: req.body.username, 
            password: hashedPassword, 
        });

        user.save(err => {
            if (err) { 
                res.json("Error!");
                return next(err);
            }
            res.json(`Successfuly signed up user - ${user.name}`);
        });
    });
};
 

