const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date_made: { type: Date, required: true },
    is_published: { type: mongoose.Schema.Types.Boolean, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectID, 
        ref: 'User',
        required: true },
    comments: [ { type: mongoose.Schema.Types.ObjectID, 
        ref: 'Comment',
        required: true } ]},
    {
        toJSON: { virtuals: true } 
    }
);

PostSchema
    .virtual('url')
    .get(function () {
        return `/posts/${this._id}`;
    });

PostSchema 
.virtual('published_url')
    .get(function () { 
        return `/posts/published_posts/${this._id}`;
    });

module.exports = mongoose.model('Post', PostSchema);
