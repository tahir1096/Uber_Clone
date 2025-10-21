import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";

const authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded._id || decoded.id;
            req.user = await userModel.findById(userId).select('-password');
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: 'Invalid token.' });
    }
}

const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captainId = decoded._id || decoded.id;
        req.captain = await captainModel.findById(captainId).select('-password');
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: 'Invalid token.' });
    }
}

export default {
    authUser,
    authCaptain
};