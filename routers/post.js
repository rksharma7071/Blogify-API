const express = require("express");
const {
  handleGetAllPosts,
  handleCreateNewPost,
  handleGetPostUinsgId,
  handleUpdatePostUsingId,
  handleDeletePostUsingId,
  handleUpdateSlug
} = require('../controllers/post')


const router = express.Router();

router.route('/')
  .get(handleGetAllPosts)
  .post(handleCreateNewPost)
  .put(handleUpdateSlug);

router.route('/:id')
  .get(handleGetPostUinsgId)
  .patch(handleUpdatePostUsingId)
  .delete(handleDeletePostUsingId)


module.exports = router;
