const express = require('express');
const {
  handleGetAllCategories,
  handleCreateNewCategory,
  handleGetCategoryUinsgId,
  handleUpdateCategoryUsingId,
  handleDeleteCategoryUsingId
} = require('../controllers/category');


const router = express.Router();

router.route('/')
  .get(handleGetAllCategories)
  .post(handleCreateNewCategory)

router.route('/:id')
  .get(handleGetCategoryUinsgId)
  .patch(handleUpdateCategoryUsingId)
  .delete(handleDeleteCategoryUsingId)

  
module.exports = router;