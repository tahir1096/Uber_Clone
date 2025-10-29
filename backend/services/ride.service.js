import rideModel from '../models/ride.model.js';
import ratingModel from '../models/rating.model.js';

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const calculateFare = (distance) => {
    // Base fare + per km rate
    const baseFare = 50; // in rupees/cents
    const perKmRate = 15;
    return baseFare + (distance * perKmRate);
};

const createRide = async ({ userId, pickup, destination, distance, duration }) => {
    if (!userId || !pickup || !destination) {
        throw new Error('User ID, pickup, and destination are required');
    }

    const fare = calculateFare(distance);
    const otp = generateOTP();

    const ride = await rideModel.create({
        user: userId,
        pickup,
        destination,
        fare,
        distance,
        duration,
        otp
    });

    return ride;
};

const acceptRide = async (rideId, captainId) => {
    if (!rideId || !captainId) {
        throw new Error('Ride ID and Captain ID are required');
    }

    const ride = await rideModel.findByIdAndUpdate(
        rideId,
        { 
            captain: captainId,
            status: 'accepted'
        },
        { new: true }
    ).populate('user captain');

    return ride;
};

const completeRide = async (rideId, otp) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    const ride = await rideModel.findById(rideId);
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    const completedRide = await rideModel.findByIdAndUpdate(
        rideId,
        {
            status: 'completed',
            completedAt: new Date(),
            paymentStatus: 'completed'
        },
        { new: true }
    );

    return completedRide;
};

const cancelRide = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    const ride = await rideModel.findByIdAndUpdate(
        rideId,
        { status: 'cancelled' },
        { new: true }
    );

    return ride;
};

const getRideById = async (rideId) => {
    if (!rideId) {
        throw new Error('Ride ID is required');
    }

    const ride = await rideModel.findById(rideId).populate('user captain');
    return ride;
};

const getUserRides = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const rides = await rideModel.find({ user: userId }).populate('captain').sort({ createdAt: -1 });
    return rides;
};

const getCaptainRides = async (captainId) => {
    if (!captainId) {
        throw new Error('Captain ID is required');
    }

    const rides = await rideModel.find({ captain: captainId }).populate('user').sort({ createdAt: -1 });
    return rides;
};

const getAvailableRides = async () => {
    const rides = await rideModel.find({ status: 'requested', captain: null }).populate('user');
    return rides;
};

const rateRide = async ({ rideId, userId, captainId, rating, comment }) => {
    if (!rideId || !userId || !captainId || !rating) {
        throw new Error('Ride ID, User ID, Captain ID, and rating are required');
    }

    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    // Check if rating already exists
    const existingRating = await ratingModel.findOne({ ride: rideId, user: userId });
    if (existingRating) {
        throw new Error('You have already rated this ride');
    }

    const ratingRecord = await ratingModel.create({
        ride: rideId,
        user: userId,
        captain: captainId,
        rating,
        comment
    });

    return ratingRecord;
};

const getCaptainRating = async (captainId) => {
    if (!captainId) {
        throw new Error('Captain ID is required');
    }

    const ratings = await ratingModel.find({ captain: captainId });
    
    if (ratings.length === 0) {
        return 0;
    }

    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return parseFloat(avgRating.toFixed(1));
};

export default {
    createRide,
    acceptRide,
    completeRide,
    cancelRide,
    getRideById,
    getUserRides,
    getCaptainRides,
    getAvailableRides,
    rateRide,
    getCaptainRating
};
