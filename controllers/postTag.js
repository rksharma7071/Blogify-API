const PostTag = require('../models/postTag');



async function handleGetAllPostTags(req, res) {
  try {
    const postTags = await PostTag.find({});
    return res.json(postTags);
  } catch (error) {
    console.error("Error PostTag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewPostTag(req, res) {
  try {
    const { post_id, tag_id } = req.body;

    if (!post_id || !tag_id) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const newPostTag = new PostTag({
      post_id, 
      tag_id
    });

    const result = await newPostTag.save();

    return res.status(201).json({
      msg: "PostTag created successfully",
      tag: {
        id: result._id,
        post_id: result.post_id,
        tag_id: result.tag_id
      }
    });
  } catch (error) {
    console.error("Error PostTag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetPostTagUinsgId(req, res) {
  try {
    const postTag = await PostTag.findById(req.params.id);
    return res.json(postTag);
  }
  catch (error) {
    console.error("Error PostTag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdatePostTagUsingId(req, res) {
  try {
    const postTag = req.body;
    await PostTag.findByIdAndUpdate(req.params.id, postTag);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error PostTag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeletePostTagUsingId(req, res) {
  try {
    await PostTag.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "PostTag deleted successfully" });
  } catch (error) {
    console.error("Error PostTag:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


module.exports = {
  handleGetAllPostTags,
  handleCreateNewPostTag,
  handleGetPostTagUinsgId,
  handleUpdatePostTagUsingId,
  handleDeletePostTagUsingId
}