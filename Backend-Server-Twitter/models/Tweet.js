const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
