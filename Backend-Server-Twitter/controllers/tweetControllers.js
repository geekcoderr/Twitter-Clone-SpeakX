import { v2 as cloudinary } from "cloudinary";
import Entity from "../models/EntityModel.js";
import Tweet from "../models/Tweet.js";


const createTweet = async (req, res) => {
	try {
		const { text, img } = req.body;
		const userId = req.user._id.toString();

		const user = await Entity.findById(userId);
		if (!user) return res.status(404).json({ message: "Entity dosen't Exist!" });

		if (!text && !img) {
			return res.status(400).json({ error: "Tweet shall contain Content!" });
		}

		let imageUrl = img;
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			imageUrl = uploadedResponse.secure_url;
		}

		const newTweet = new Tweet({
			user: userId,
			text,
			img: imageUrl,
		});

		await newTweet.save();
		res.status(201).json(newTweet);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const removeTweet = async (req, res) => {
	try {
		const tweet = await Tweet.findById(req.params.id);
		if (!tweet) {
			return res.status(404).json({ error: "Tweet dosen't Exist!" });
		}

		if (tweet.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You can't Perform this Operation!" });
		}

		if (tweet.img) {
			const imgId = tweet.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Tweet.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Tweet Deleted!" });
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const addComment = async (req, res) => {
	try {
		const { text } = req.body;
		const tweetId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text shall be there!" });
		}

		const tweet = await Tweet.findById(tweetId);
		if (!tweet) {
			return res.status(404).json({ error: "Tweet dosen't Exist!" });
		}

		const comment = { user: userId, text };
		tweet.comments.push(comment);
		await tweet.save();

		res.status(200).json(tweet);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const toggleLikeTweet = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: tweetId } = req.params;

		const tweet = await Tweet.findById(tweetId);
		if (!tweet) {
			return res.status(404).json({ error: "Tweet dosen't Exist!" });
		}

		const userLikedTweet = tweet.likes.includes(userId);
		if (userLikedTweet) {
			await Tweet.updateOne({ _id: tweetId }, { $pull: { likes: userId } });
			await Entity.updateOne({ _id: userId }, { $pull: { likedPosts: tweetId } });

			const updatedLikes = tweet.likes.filter(id => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			tweet.likes.push(userId);
			await Entity.updateOne({ _id: userId }, { $push: { likedPosts: tweetId } });
			await tweet.save();

			const notification = new Notification({
				from: userId,
				to: tweet.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = tweet.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const getAllTweets = async (req, res) => {
	try {
		const tweets = await Tweet.find()
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(tweets);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const getLikedTweets = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await Entity.findById(userId);
		if (!user) return res.status(404).json({ error: "Tweet dosen't Exist!" });

		const likedTweets = await Tweet.find({ _id: { $in: user.likedPosts } })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(likedTweets);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const getFollowingTweets = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await Entity.findById(userId);
		if (!user) return res.status(404).json({ error: "Tweet dosen't Exist!" });

		const following = user.following;
		const feedTweets = await Tweet.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(feedTweets);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const getUserTweets = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await Entity.findOne({ username });
		if (!user) return res.status(404).json({ error: "Tweet dosen't Exist!" });

		const tweets = await Tweet.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(tweets);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

export {
	addComment, createTweet, getAllTweets, getFollowingTweets, getLikedTweets, getUserTweets, removeTweet, toggleLikeTweet
};

