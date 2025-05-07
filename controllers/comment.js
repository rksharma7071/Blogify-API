const Comment = require('../models/comment');



async function handleGetAllComments(req, res) {
  try {
    const comments = await Comment.find({});
    return res.json(comments);
  } catch (error) {
    console.error("Error Comment:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleCreateNewComment(req, res) {
  try {
    const { post_id, user_id, content } = req.body;

    if (!post_id || !user_id || !content) {
      return res.status(400).json({ msg: "All fields are required..." });
    }

    const newComment = new Comment({
      post_id, 
      user_id,
      content
    });

    const result = await newComment.save();

    return res.status(201).json({
      msg: "Comment created successfully",
      tag: {
        id: result._id,
        post_id: result.post_id,
        user_id: result.user_id
      }
    });
  } catch (error) {
    console.error("Error Comment:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleGetCommentUinsgId(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    return res.json(comment);
  }
  catch (error) {
    console.error("Error Comment:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUpdateCommentUsingId(req, res) {
  try {
    const comment = req.body;
    await Comment.findByIdAndUpdate(req.params.id, comment);
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error Comment:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleDeleteCommentUsingId(req, res) {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    return res.json({ status: "success", message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error Comment:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}


module.exports = {
  handleGetAllComments,
  handleCreateNewComment,
  handleGetCommentUinsgId,
  handleUpdateCommentUsingId,
  handleDeleteCommentUsingId
}