const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../models/post');
const Comment = require('../models/comment');
const admin = require('../helpers/admin');
const { DateTime } = require("luxon");
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.all_posts = (req, res, next) => {
    Post.find({ author: admin.ID })
        .populate('author')
        .exec((err, posts) => {
        if (err) { return next(err) }
        return res.json(posts);
    });
};

exports.published_posts = (req, res, next) => {
    Post.find({ author: admin.ID, is_published: true })
        .sort({ date_made: -1 })
        .populate('author').exec((err, posts) => {
        if (err) { return next(err) }
        return res.json(posts);
    });
};

exports.published_post_detail = (req, res, next) => {
    Post.findOne({ _id: req.params.postID, is_published: true }).exec((err, post) =>{
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

exports.post_create = [
    body('name').trim().isLength({ min: 1 }).escape(),
    // trimming for the IE users - w no date input support
    // * if input is in form YYYY-MM-DD, passing isISO8601, no 
    //   need to escape - since chars used for injection like ''
    //   "" are implictly screened for
    body('date_made').isISO8601().toDate(),
    body('is_published').isBoolean(),
    body('content').trim().isLength({ min: 1 }).escape(),
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

// COMMENTS

exports.published_post_comments = (req, res, next) => {
    Post
        .findOne({ _id: req.params.postID, is_published: true })
        .populate('comments')
        .exec((err, post) => {
            if (err) { return next(err) }
            res.json(post.comments);
        });
};

exports.post_comments = (req, res, next) => {
    Post.find().exec((err, posts) => {
    });
    Post
        .findById(req.params.postID)
        .populate('comments')
        .exec((err, post) => {
            if (err) { return next(err) }
            res.json(post.comments);
        });
};

exports.post_comment_create = [
    body('author').trim().isLength({ min: 1 }).escape(),  
    body('email').trim().matches(/.+@.*\.(ca|com|ru|su|jp|kr)/).escape(),
    body('date_made').isISO8601().toDate(),  
    body('content').trim().isLength({ min: 1 }).escape(),  
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

            return res.status(422).json({
                timestamp: DateTime.now(),
                status: 422, 
                error: 'Unprocessable Entity', 
                message: `Fix following validation errors: ${errorMessages}`, 
                path: `/posts/published_posts/${req.params.postID}/comments`,
            });
        }

        const comment = new Comment({
            author: req.body.author,
            email: req.body.email,
            date_made: req.body.date_made,
            content: req.body.content,
        });

        async.parallel([
            function (callback) {
                comment.save(callback);
            },
            function (callback) {
                Post.findByIdAndUpdate(req.params.postID, {
                    $push: { comments: comment }
                }).exec(callback);
            }
        ], (err, results) => {
            if (err) { return next(err) }
            res.status(200).json('saved comment');
        })
    }
];

exports.post_comment_update = (req, res, next) => {
    Post.findByIdAndUpdate(req.params.postID, { $set: req.body })
        .exec((err, updatedPost) => {
            if (err) { return next(err) }
            res.status(200);
            res.json('updated comment')
        });
};

exports.post_comment_delete = (req, res, next) => {
    async.parallel([
        function (callback) {
            Post.findByIdAndUpdate(req.params.postID, 
                { $pull: { comments: req.params.commentID } })
            .exec(callback);
        }, 
        function (callback) {
            Comment.findByIdAndDelete(req.params.commentID).exec(callback);
        }], (err, results) => {
            if (err) { return next(err) }
            res.status(200).json('deleted comment');
        });
};




