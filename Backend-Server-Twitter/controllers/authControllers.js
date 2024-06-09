import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import Entity from "../models/user.model.js";


const fetchLastState = async (req, res) => {
	try {
		const entity = await Entity.findById(req.user._id).select("-password");
		res.status(200).json(entity);
	} catch (error) {
		// Used for getting data
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const fetchLastStatusJSON = async (req, res) => {
	try {
		// to serve data over testing.
		const entity = await Entity.findById(req.user._id).select("-password");
		res.status(200).json(entity);
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const signIn = async (req, res) => {
	try {
		const { username, password } = req.body;
		const entity = await Entity.findOne({ username });
		const credentialsMatch = await bcrypt.compare(password, entity?.password || "");

		if (!entity || !credentialsMatch) {
			return res.status(400).json({ error: "Credentials Invalid!" });
		}

		generateTokenAndSetCookie(entity._id, res);

		res.status(200).json({
			_id: entity._id,
			fullName: entity.fullName,
			username: entity.username,
			email: entity.email,
			followers: entity.followers,
			following: entity.following,
			profileImg: entity.profileImg,
			coverImg: entity.coverImg,
		});
	} catch (error) {
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};

const signOut = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "entity Logged out!" });
	} catch (error) {
		// Unable to Logout at this moment
		res.status(500).json({ error: "Unable to Logout at this Moment." });
	}
};


const register = async (req, res) => {
	try {
		const { fullName, username, email, password } = req.body;


		const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordFormat.test(password)) {
			return res.status(400).json({ error: "Standard Password format must be followed!" });
		}

		const existingEmail = await Entity.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email Already in Use!" });
		}

		const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailFormat.test(email)) {
			return res.status(400).json({ error: "Email format Not-valid!" });
		}

		const existingUser = await Entity.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username Already in Use!" });
		}

		const salt = await bcrypt.genSalt(10);
		const cipher = await bcrypt.hash(password, salt);

		const userSchema = new Entity({
			fullName,
			username,
			email,
			password: cipher,
		});

		if (userSchema) {
			generateTokenAndSetCookie(userSchema._id, res);
			await userSchema.save();

			res.status(201).json({
				_id: userSchema._id,
				fullName: userSchema.fullName,
				username: userSchema.username,
				email: userSchema.email,
				followers: userSchema.followers,
				following: userSchema.following,
				profilePic: userSchema.profiePic,
				backgImg: userSchema.backgPic,
			});
		} else {
			res.status(400).json({ error: "entity Data is Invalid!" });
		}
	} catch (error) {
		// Error if Server is not running or not reachable.
		res.status(500).json({ error: "Server-Down Or Unreachable!" });
	}
};


export {
	fetchLastState, fetchLastStatusJSON, register, signIn, signOut
};

