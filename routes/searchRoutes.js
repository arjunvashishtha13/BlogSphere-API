const express = require('express');
const { searchSuggestions } = require('../controllers/searchController');

const router = express.Router();

router.get('/suggestions', searchSuggestions);

module.exports = router;
