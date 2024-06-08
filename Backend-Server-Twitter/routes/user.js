const express = require('express');
const { followUser, unfollowUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/follow/:id', authMiddleware, followUser);
router.post('/unfollow/:id', authMiddleware, unfollowUser);

module.exports = router;
