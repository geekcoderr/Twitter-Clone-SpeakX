const User = require('../models/User');

const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        const currentUser = await User.findById(req.user.id);
        if (currentUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: 'Already following this user' });
        }
        currentUser.following.push(req.params.id);
        userToFollow.followers.push(req.user.id);
        await currentUser.save();
        await userToFollow.save();
        res.status(200).json({ message: 'User followed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        const currentUser = await User.findById(req.user.id);
        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);
        await currentUser.save();
        await userToUnfollow.save();
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { followUser, unfollowUser };
