const express = require('express');
const {
  handleGetAllTags,
  handleCreateNewTag,
  handleGetTagUinsgId,
  handleUpdateTagUsingId,
  handleDeleteTagUsingId
} = require('../controllers/tag');


const router = express.Router();

router.route('/')
  .get(handleGetAllTags)
  .post(handleCreateNewTag)

router.route('/:id')
  .get(handleGetTagUinsgId)
  .patch(handleUpdateTagUsingId)
  .delete(handleDeleteTagUsingId)

  
module.exports = router;