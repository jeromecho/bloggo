const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/post');

module.exports = router;

router.get('/', post_controller.posts);
router.get('/:postID', post_controller.post_detail);

router.post('/', post_controller.post_create);

router.put('/:postID', post_controller.post_update);

router.delete('/:postID', post_controller.post_delete);





