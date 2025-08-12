const Post = require("../models/post");
const User = require("../models/user");
const Category = require("../models/category");
const Tag = require("../models/tag");
const slugify = require("slugify");

async function handleGetAllPosts(req, res) {
  try {
    const posts = await Post.find({})
      .populate("author_id", "username first_name last_name") // Optional: Populate author details
      .populate("category_id", "name") // Optional: Populate category name
      .populate("tags", "name"); // Optional: Populate tag names
    return res.json(posts);
  } catch (error) {
    console.error("Error Post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewPost(req, res) {
  try {
    let { title, content, author_id, category_id, tags, status } = req.body;

    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ error: "Invalid tags format" });
      }
    }

    if (!title || !content || !author_id || !category_id || !tags || !status) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const author = await User.findById(author_id);
    if (!author) return res.status(400).json({ msg: "Author not found." });

    const category = await Category.findById(category_id);
    if (!category) return res.status(400).json({ msg: "Category not found." });

    const tagExists = await Tag.find({ _id: { $in: tags } });
    if (tagExists.length !== tags.length) {
      return res.status(400).json({ msg: "Some tags are invalid." });
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const existingPost = await Post.findOne({
      $or: [{ slug: baseSlug }, { title }],
    });

    if (existingPost) {
      return res.status(200).json({
        msg: "Post already exists",
        post: {
          id: existingPost._id,
          slug: existingPost.slug,
          title: existingPost.title,
          status: existingPost.status,
          createdAt: existingPost.createdAt,
        },
      });
    }

    let slug = baseSlug;
    let counter = 1;
    while (await Post.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    console.log("Request: ", req);
    const featured_image = req.file ? `/uploads/${req.file.filename}` : "";
    console.log("featured_image: ", featured_image);
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
        featured_image: result.featured_image,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetPostUinsgId(req, res) {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author_id", "username first_name last_name")
      .populate("category_id", "name")
      .populate("tags", "name");

    if (!post) return res.status(404).json({ msg: "Post not found" });

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdatePostUsingId(req, res) {
  try {
    const { slug } = req.params;
    let { title, content, author_id, category_id, tags, status } = req.body;

    // Find the post by slug
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    // Convert tags from string to array if needed
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ error: "Invalid tags format" });
      }
    }

    // Validate fields if provided
    if (author_id) {
      const author = await User.findById(author_id);
      if (!author) return res.status(400).json({ msg: "Author not found." });
    }

    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category)
        return res.status(400).json({ msg: "Category not found." });
    }

    if (tags && tags.length > 0) {
      const tagExists = await Tag.find({ _id: { $in: tags } });
      if (tagExists.length !== tags.length) {
        return res.status(400).json({ msg: "Some tags are invalid." });
      }
    }

    // If title changes, generate unique slug
    if (title && title !== post.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      let newSlug = baseSlug;
      let counter = 1;
      while (await Post.exists({ slug: newSlug, _id: { $ne: post._id } })) {
        newSlug = `${baseSlug}-${counter++}`;
      }
      post.slug = newSlug;
      post.title = title;
    }

    // Update other fields if provided
    if (content) post.content = content;
    if (author_id) post.author_id = author_id;
    if (category_id) post.category_id = category_id;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    // Update featured image if new file uploaded
    if (req.file) {
      post.featured_image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await post.save();

    return res.status(200).json({
      msg: "Post updated successfully",
      post: {
        id: updatedPost._id,
        slug: updatedPost.slug,
        title: updatedPost.title,
        status: updatedPost.status,
        featured_image: updatedPost.featured_image,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeletePostUsingId(req, res) {
  try {
    const deletedPost = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!deletedPost) return res.status(404).json({ msg: "Post not found" });

    return res.json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post by slug:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

const handleUpdateSlug = async (req, res) => {
  try {
    const posts = await Post.find({}, { _id: 1, title: 1, slug: 1 }).lean();

    const existingSlugs = new Set(posts.map((p) => p.slug));
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
            update: { $set: { slug } },
          },
        });
      }
    }

    if (ops.length) await Post.bulkWrite(ops);

    res
      .status(200)
      .json({ updated: ops.length, message: "Slugs updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Slug update failed", details: err.message });
  }
};

module.exports = {
  handleGetAllPosts,
  handleCreateNewPost,
  handleGetPostUinsgId,
  handleUpdatePostUsingId,
  handleDeletePostUsingId,
  handleUpdateSlug,
};
