import captainModel from "../models/captain.model.js";
import captainService from "../services/captain.service.js";
import { validationResult } from "express-validator";
import blacklistTokenModel from "../models/blacklistToken.model.js";

const registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }   
    const { fullname, email, password, vehicle } = req.body;
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(409).json({ message: "Captain already exists" });
    }
    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plateNumber: vehicle.plateNumber,
        seatingCapacity: vehicle.seatingCapacity,
        vehicleType: vehicle.vehicleType,
        model: vehicle.model
    });

    const token = captain.generateAuthToken();
    res.status(201).json({
        message: "Captain registered successfully ✅",
        token,
        captain: {
            _id: captain._id,
            firstname: captain.firstname,
            lastname: captain.lastname,
            email: captain.email,
            vehicle: {
                color: captain.vehicleDetails.color,
                plateNumber: captain.vehicleDetails.plateNumber,
                seatingCapacity: captain.vehicleDetails.seatingCapacity,
                vehicleType: captain.vehicleDetails.vehicleType
            }
        }
      });
    }

const loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({
        message: "Captain logged in successfully ✅",
        token,
        captain: {
            _id: captain._id,
            firstname: captain.firstname,
            lastname: captain.lastname,
            email: captain.email
        }
    });
}

const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

const logoutCaptain = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({ token });
    res.status(200).json({ message: "Captain logged out successfully ✅" });
}

export default {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
};