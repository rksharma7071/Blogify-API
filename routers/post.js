const express = require("express");
const upload = require("../middlewares/upload");
const {
  handleGetAllPosts,
  handleCreateNewPost,
  handleGetPostUinsgId,
  handleUpdatePostUsingId,
  handleDeletePostUsingId,
  handleUpdateSlug,
} = require("../controllers/post");

const router = express.Router();

// Use .single() for single image file upload
router.route("/")
  .get(handleGetAllPosts)
  .post(upload.single("featured_image"), handleCreateNewPost)
  .put(handleUpdateSlug);

router.route("/:slug")
  .get(handleGetPostUinsgId)
  .patch(handleUpdatePostUsingId)
  .delete(handleDeletePostUsingId);

module.exports = router;
