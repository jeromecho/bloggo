const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    email: { type: String, required: true },
    date_made: { type: Date, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
