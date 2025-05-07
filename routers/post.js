const express = require("express");
const {
  handleGetAllPosts,
  handleCreateNewPost,
  handleGetPostUinsgId,
  handleUpdatePostUsingId,
  handleDeletePostUsingId
} = require('../controllers/post')


const router = express.Router();

router.route('/')
  .get(handleGetAllPosts)
  .post(handleCreateNewPost);

router.route('/:id')
  .get(handleGetPostUinsgId)
  .patch(handleUpdatePostUsingId)
  .delete(handleDeletePostUsingId)

  
module.exports = router;
