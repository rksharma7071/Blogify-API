const express = require('express');
const router = express.Router();
const { handleAuthLogin, handleAuthSignUp } = require('../controllers/auth');


router.route('/signup')
  .post(handleAuthSignUp);
router.route('/login')
  .post(handleAuthLogin);


module.exports = router;