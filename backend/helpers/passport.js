const passport = require('passport');
const bcrypt = require('bcryptjs');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

passport.use(new LocalStrategy (function (username, password, done) {
    User.find({ username }).exec((err, users) => {
        if (err) { return done(err) }
        else if (users.length == 0) {
            return done(null, false, { message: "User not found!" }) 
        } else {
            let hasErr = false;
            let bcryptErr = null;
            let hasRes = false;
            let userToReturn = null;
            const promises = [];
            
            for (const user of users) { 
                const promise = new Promise((resolve, reject) => {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (err) { 
                            [hasErr, bcryptErr] = [true, err];
                        } else if (res) {
                            console.log("yippe!")
                            hasRes = true;
                            userToReturn = user;
                        } 
                        resolve();
                    });
                });
                promises.push(promise);
                console.log(promise)
            }

            Promise.all(promises).then((values) => {
                console.log(hasRes)
                if (hasRes) {
                    return done(null, userToReturn);
                } else if (hasErr) {
                    return done(bcryptErr);
                } else {
                    return done(null, false, { message: "Incorrect password" });
                }
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
