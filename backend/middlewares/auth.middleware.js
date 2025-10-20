import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // token payload uses _id in the user model's generateAuthToken
            const userId = decoded._id || decoded.id;
            req.user = await userModel.findById(userId).select('-password');
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: 'Invalid token.' });
    }
}
export default authUser;