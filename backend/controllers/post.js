const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../models/post');
const { adminID } = require('../helpers/admin');
const { DateTime } = require("luxon");
const { body, validationResult } = require('express-validator');

exports.all_posts = (req, res, next) => {
    Post.find({ author: adminID }).exec((err, posts) => {
        if (err) { return next(err) }
        return res.json(posts);
    });
};

exports.published_posts = (req, res, next) => {
    Post.find({ author: adminID, is_published: true }).exec((err, posts) => {
        if (err) { return next(err) }
        return res.json(posts);
    });
};
// TODO - on user - when user signs in, set the adminID to their userID 
//        so that they can only access their own posts

// TODO - restrict to adminID
exports.published_post_detail = (req, res, next) => {
    Post.findById(req.params.postID, is_published: true).exec((err, post) =>{
        if (err) { return next(err) }
        res.json(post);
    });
};

exports.post_detail = (req, res, next) => {
    Post.findById(req.params.postID).exec((err, post) =>{
        if (err) { return next(err) }
        res.json(post);
    });
};

// TODO - link with authentication!
// 1. Create separate passport.js file in folder called authenticated, and require that in your app.js
// 2. passport.authenticate('jwt') ...
exports.post_create = [
    body('name').trim().isLength({ min: 1 }).escape(),
    // trimming for the IE users - w no date input support
    // * if input is in form YYYY-MM-DD, passing isISO8601, no 
    //   need to escape - since chars used for injection like ''
    //   "" are implictly screened for
    body('date_made').isISO8601().toDate(),
    body('is_published').isBoolean(),
    body('content').trim().isLength({ min: 1 }).escape(),
    // TODO - escaping since a determined attacker could manually tweak the 
    // vals of inputs - will need helper to decode and remove escaped values
    body('author').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const post = new Post({
            name: req.body.name,
            date_made: req.body.date_made,
            is_published:req.body.is_published, 
            content: req.body.content,
            author: req.body.author,
            comments: [],
        });

        post.save((err, user) => {
            if (err) { return next(err) }
            res.json(`Successfully added user ${user}`)
        });
    }
];

exports.post_update = [
    body('name')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('date_made')
    .isISO8601()
    .toDate(),
    body('is_published')
    .optional({ checkFalsy: true })
    .isBoolean(),
    body('content')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('author')
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body('comments.*').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) { 
            const errorMessages = errors.array().reduce((prev, curr) => {
                if (prev.msg === undefined) {
                    return curr.msg + ' - ' + curr.param;
                }
                return (prev.msg + ' - ' + prev.param + ', ' + curr.msg + ' - '
                    + curr.param + ',');
            }, '');

            res.status(422).json({
                timestamp: DateTime.now(),
                status: 422, 
                error: 'Unprocessable Entity', 
                message: `Fix following validation errors: ${errorMessages}`, 
                path: `/posts/${req.params.postID}`,
            });
        }

        Post.updateOne({ _id: req.params.postID },

            { $set: req.body}).exec((err, post) => {
                if (err) { return next(err) }

                res.json("post update success");
            });
    }
];

exports.post_delete = (req, res, next) => {
    Post.findByIdAndDelete(req.params.postID).exec((err, post) => {
        if (err) { return next(err) }

        res.json(`Successfully deleted post - ${post}`);
    });
};

