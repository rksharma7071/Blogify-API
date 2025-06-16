const express = require('express');
const { predictiveSearch } = require('../controllers/search');

const router = express.Router();

router.get('/', predictiveSearch);


module.exports = router;
