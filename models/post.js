const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  featured_image: { type: String }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
