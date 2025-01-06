import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const rawToken = req.cookies[process.env.JWT_COOKIE_NAME];

        if (!rawToken) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No Token Provided" });
        }

        const token = jwt.verify(rawToken, process.env.JWT_SECRET);

        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(token.userID).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
