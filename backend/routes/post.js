const express = require('express');
const passport = require('passport');
const router = express.Router();
const post_controller = require('../controllers/post');
require('../helpers/passport');

module.exports = router;

// COMMENTS 
// run for both '/comments' and '/published_posts/:postID/comments'
router.get('/published_posts/:postID/comments', post_controller.post_comments)
router.get('/:postID/comments', passport.authenticate('jwt', { session: false }), post_controller.post_comments);

router.post('/.published_posts/:postID/comments', post_controller.post_comment_create);

router.put('/:postID/comments/:commentID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_comment_update);

router.delete('/:postID/comments/:commentID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_comment_delete);


router.get('/published_posts', post_controller.published_posts);

router.get('/published_posts/:postID', post_controller.published_post_detail);

router.get('/',
    passport.authenticate('jwt', { session: false }),
    post_controller.all_posts);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_create);

router.get('/:postID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_detail);

router.put('/:postID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_update);

router.delete('/:postID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_delete);





