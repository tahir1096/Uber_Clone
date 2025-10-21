import mongoose, { model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required: true,
        minLength: [3, 'First name must be at least 3 characters long']
    },
    lastname: {
        type : String,
        required: false,
        minLength: [3, 'Last name must be at least 3 characters long']
    },
    email: {
        type : String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email address']
    },
    password: {
        type : String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long']
    },
    socketId: {
        type: String,
    },
    status:{
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'inactive'
    },
    vehicleDetails: {
        color: {
            type: String,
            required: true,
            minLength: [2, 'Vehicle color must be at least 2 characters long']
        },
        plateNumber: {
            type: String,
            required: true,
            minLength: [5, 'Plate number must be at least 5 characters long']
        },
        seatingCapacity: {
            type: Number,
            required: true,
            minLength: [1, 'Seating capacity must be at least 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['bike', 'car', 'auto-rikshaw',]
        },
    },
    model: {
        type: String,
        required: true,
        minLength: [2, 'Vehicle model must be at least 2 characters long']
    },
    location: {
        longitude: {
            type: Number,
        },
        latitude: { 
            type: Number,
        },
    }
})

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id},
        process.env.JWT_SECRET, { expiresIn: '24h' })
        return token;
    };
captainSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
}
captainSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
const captainModel = model('captain', captainSchema);
export default captainModel;