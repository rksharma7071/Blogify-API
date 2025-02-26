const mongoose = require('mongoose');

const postTagSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  tag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
}, { timestamps: true });

const PostTag = mongoose.model('PostTag', postTagSchema);
module.exports = PostTag;
