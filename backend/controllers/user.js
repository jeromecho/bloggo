const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;
const admin = require('../helpers/admin');
require('dotenv').config();
require('../helpers/passport');

exports.login_user = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (!user || err) { 
            return next(err)
        }
        if (info) { 
            return next(err);
        }
        admin.ID = user._id;
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json(token);
    }) (req, res);
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
        if (err) { 
            return next(err);
        }
        
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
            res.json(`Successfully signed up user ${user.name}`);
        });
    });
};
 

