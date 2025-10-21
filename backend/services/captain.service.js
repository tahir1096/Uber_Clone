import captainModel from "../models/captain.model.js";

const createCaptain = async ({
    firstname, lastname, email, password, color, plateNumber, seatingCapacity, vehicleType, model
}) => {
    if (!firstname || !email || !password || !color || !plateNumber || !seatingCapacity || !vehicleType || !model) {
        throw new Error('Missing required fields to create a captain');
    }
    const captain = await captainModel.create({
        firstname,
        lastname,
        email,
        password,
        model,
        vehicleDetails: {
            color,
            plateNumber,
            seatingCapacity,
            vehicleType,
        },
    });
    await captain.save();
    return captain;
}
export default {
    createCaptain,
};