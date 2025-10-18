import userModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id);
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: 'Invalid token.' });
    }
}