const Tweet = require('../models/Tweet');

const createTweet = async (req, res) => {
    const { content, image, video } = req.body;
    try {
        const tweet = new Tweet({
            content,
            image,
            video,
            author: req.user.id,
        });
        await tweet.save();

        const io = req.app.get('io');
        io.emit('newTweet', tweet);

        res.status(201).json(tweet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find({ author: { $in: req.user.following } })
                                  .populate('author', 'username')
                                  .sort({ createdAt: -1 });
        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = { createTweet, getTweets };
