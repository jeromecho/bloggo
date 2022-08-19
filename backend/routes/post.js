const express = require('express');
const passport = require('passport');
const router = express.Router();
const post_controller = require('../controllers/post');
require('../helpers/passport');

module.exports = router;

router.get('/',
    passport.authenticate('jwt', { session: false }),
    post_controller.all_posts);

router.get('/:postID',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_detail);

router.get('/published_posts', post_controller.published_posts);

router.get('/published_posts/:postID', post_controller.published_post_detail);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    post_controller.post_create);

router.put('/:postID', post_controller.post_update);

router.delete('/:postID', post_controller.post_delete);





