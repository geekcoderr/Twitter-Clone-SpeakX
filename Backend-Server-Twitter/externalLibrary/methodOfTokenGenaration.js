import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	res.cookie("jwt", token, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development",
        // some bounded features
        signed: true
	});
};
