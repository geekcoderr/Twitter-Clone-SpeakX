const express = require('express');
const { createTweet, getTweets } = require('../controllers/tweetController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTweet);
router.get('/', authMiddleware, getTweets);

module.exports = router;
