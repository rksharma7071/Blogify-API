const express = require("express");
const {
  handleGetAllUsers,
  handleCreateNewUser,
  handleGetUserUinsgId,
  handleUpdateUserUsingId,
  handleDeleteUserUsingId
} = require('../controllers/user')


const router = express.Router();

router.route('/')
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);

router.route('/:id')
  .get(handleGetUserUinsgId)
  .patch(handleUpdateUserUsingId)
  .delete(handleDeleteUserUsingId)


module.exports = router;
