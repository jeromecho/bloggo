const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/user.js');
const LocalStrategy = require('passport-local').Strategy;
const admin = require('../helpers/admin');
const { DateTime } = require('luxon');
require('dotenv').config();
require('../helpers/passport');

exports.login_user = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(422).json({
                timestamp: DateTime.now(),
                status: 422, 
                error: 'Unprocessable Entity', 
                message: `${err}`, 
                path: `/users/login`,
            });
        }
        if (!user | info) { 
            console.log(info)
            console.log(user)
            return res.status(401).json({
                timestamp: DateTime.now(),
                status: 401, 
                error: 'Unauthorized', 
                message: `Invalid credentials`, 
                path: `/users/login`,
            });
        }
        process.env["ADMIN_ID"] = user._id;
        admin.update();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        res.cookie('token', token, { httpONly: true})
        res.json(token);
    }) (req, res);
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
 

