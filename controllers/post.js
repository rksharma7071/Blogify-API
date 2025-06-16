const Post = require('../models/post');
const User = require('../models/user');
const Category = require('../models/category');
const Tag = require('../models/tag');
const slugify = require('slugify');


async function handleGetAllPosts(req, res) {
  try {
    const posts = await Post.find({}).populate('author_id', 'username first_name last_name')  // Optional: Populate author details
      .populate('category_id', 'name')  // Optional: Populate category name
      .populate('tags', 'name');  // Optional: Populate tag names
    return res.json(posts);
  } catch (error) {
    console.error("Error Post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewPost(req, res) {
  try {
    const { title, content, author_id, category_id, tags, status, featured_image } = req.body;

    if (!title || !content || !author_id || !category_id || !tags || !status) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const author = await User.findById(author_id);
    if (!author) return res.status(400).json({ msg: "Author not found." });

    const category = await Category.findById(category_id);
    if (!category) return res.status(400).json({ msg: "Category not found." });

    const tagExists = await Tag.find({ '_id': { $in: tags } });
    if (tagExists.length !== tags.length) {
      return res.status(400).json({ msg: "Some tags are invalid." });
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    let slug = baseSlug;
    let counter = 1;

    while (await Post.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newPost = new Post({
      slug,
      title,
      content,
      author_id,
      category_id,
      tags,
      status,
      featured_image,
    });

    const result = await newPost.save();

    return res.status(201).json({
      msg: "Post created successfully",
      post: {
        id: result._id,
        slug: result.slug,
        title: result.title,
        status: result.status,
        createdAt: result.createdAt
      }
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


async function handleGetPostUinsgId(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    return res.json(post);
  } catch (error) {
    console.error("Error Post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdatePostUsingId(req, res) {
  try {
    const post = req.body;
    await Post.findByIdAndUpdate(req.params.id, post);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error Post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeletePostUsingId(req, res) {
  try {
    await Post.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    console.error("Error Post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

const handleUpdateSlug = async (req, res) => {
  try {
    const posts = await Post.find({}, { _id: 1, title: 1, slug: 1 }).lean();

    const existingSlugs = new Set(posts.map(p => p.slug));
    const updatedSlugs = new Set();

    const ops = [];

    for (const post of posts) {
      const base = slugify(post.title, { lower: true, strict: true });
      let slug = base;
      let i = 1;

      while (existingSlugs.has(slug) || updatedSlugs.has(slug)) {
        slug = `${base}-${i++}`;
      }

      if (slug !== post.slug) {
        updatedSlugs.add(slug);
        ops.push({
          updateOne: {
            filter: { _id: post._id },
            update: { $set: { slug } }
          }
        });
      }
    }

    if (ops.length) await Post.bulkWrite(ops);

    res.status(200).json({ updated: ops.length, message: 'Slugs updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Slug update failed', details: err.message });
  }
};


module.exports = {
  handleGetAllPosts,
  handleCreateNewPost,
  handleGetPostUinsgId,
  handleUpdatePostUsingId,
  handleDeletePostUsingId,
  handleUpdateSlug
}