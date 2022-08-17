const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectID, required: true },
    name: { type: String, required: true },
    date_made: { type: Date, required: true },
    is_published: { type: mongoose.Schema.Types.Boolean, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectID, required: true },
    comments: [ { type: mongoose.Schema.Types.ObjectID, required: true } ],
});

PostSchema
    .virtual('url')
    .get(function () {
        return `/posts/${this._id}`;
    });

module.exports = mongoose.model('Post', PostSchema);
