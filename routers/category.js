const express = require('express');
const {
  handleGetAllCategories,
  handleCreateNewCategory,
  handleGetCategoryUinsgId,
  handleUpdateCategoryUsingId,
  handleDeleteCategoryUsingId,
  handleUpdateSlug
} = require('../controllers/category');


const router = express.Router();

router.route('/')
  .get(handleGetAllCategories)
  .post(handleCreateNewCategory)
  .patch(handleUpdateSlug);
router.route('/:id')
  .get(handleGetCategoryUinsgId)
  .patch(handleUpdateCategoryUsingId)
  .delete(handleDeleteCategoryUsingId)

  
module.exports = router;