import jwt from "jsonwebtoken";
import Entity from "../models/EntityModel.js";

const authSecurity = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Invalid Token" });
		}

		const user = await Entity.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "Entity not-found" });
		}

		req.user = user;
		next();
	} catch (err) {
		return res.status(500).json({ error: "Middleware Encountered Error!" });
	}
};

export {
	authSecurity
};

