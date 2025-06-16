const Post = require('../models/post');
const Category = require('../models/category');
const Tag = require('../models/tag');

const predictiveSearch = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ msg: "Search query is required" });

    const regex = new RegExp(q, 'i');

    const results = {};

    if (!type || type === 'post') {
      results.posts = await Post.find({ title: regex }, { _id: 1, title: 1, slug: 1 }).limit(10);
    }

    if (!type || type === 'category') {
      results.categories = await Category.find({ name: regex }, { _id: 1, name: 1 }).limit(10);
    }

    if (!type || type === 'tag') {
      results.tags = await Tag.find({ name: regex }, { _id: 1, name: 1 }).limit(10);
    }

    res.status(200).json({ query: q, ...results });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { predictiveSearch };
