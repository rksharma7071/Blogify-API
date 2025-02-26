const express = require('express');
const {
  handleGetAllComments,
  handleCreateNewComment,
  handleGetCommentUinsgId,
  handleUpdateCommentUsingId,
  handleDeleteCommentUsingId
} = require('../controllers/comment');


const router = express.Router();

router.route('/')
  .get(handleGetAllComments)
  .post(handleCreateNewComment)

router.route('/:id')
  .get(handleGetCommentUinsgId)
  .patch(handleUpdateCommentUsingId)
  .delete(handleDeleteCommentUsingId)


module.exports = router;