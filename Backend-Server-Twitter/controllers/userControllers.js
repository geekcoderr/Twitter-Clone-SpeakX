import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import Entity from "../models/EntityModel.js";

const fetchUserDetails = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await Entity.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ message: "Person is not there" });

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const modifyFollowStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await Entity.findById(id);
		const currentUser = await Entity.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "This Operation is not Allowed!" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "Person is not there" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await Entity.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await Entity.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "Unfollowed!" });
		} else {
			// Follow the user
			await Entity.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await Entity.findByIdAndUpdate(req.user._id, { $push: { following: id } });

			res.status(200).json({ message: "Started Following!" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const fetchSuggestedEntities = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await Entity.findById(userId).select("following");

		const users = await Entity.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const modifyEntityDetails = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await Entity.findById(userId);
		if (!user) return res.status(404).json({ message: "Person is not there" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Must Provide both Current & New Password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current Password is incorrect" });
			const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
			if (!passwordFormat.test(newPassword)) {
			return res.status(400).json({ error: "Standard Password format must be followed!" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		if (backgroundPic) {
			if (user.backgroundPic) {
				await cloudinary.uploader.destroy(user.backgroundPic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(backgroundPic);
			backgroundPic = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profilePic = profilePic || user.profilePic;
		user.backgroundPic = backgroundPic || user.backgroundPic;

		user = await user.save();

		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { fetchSuggestedEntities, fetchUserDetails, modifyEntityDetails, modifyFollowStatus };
