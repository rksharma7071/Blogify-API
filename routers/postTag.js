const express = require('express');
const {
  handleGetAllPostTags,
  handleCreateNewPostTag,
  handleGetPostTagUinsgId,
  handleUpdatePostTagUsingId,
  handleDeletePostTagUsingId
} = require('../controllers/postTag');


const router = express.Router();

router.route('/')
  .get(handleGetAllPostTags)
  .post(handleCreateNewPostTag)

router.route('/:id')
  .get(handleGetPostTagUinsgId)
  .patch(handleUpdatePostTagUsingId)
  .delete(handleDeletePostTagUsingId)

  
module.exports = router;