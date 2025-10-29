import { validationResult } from 'express-validator';
import rideService from '../services/ride.service.js';
import rideModel from '../models/ride.model.js';

export const bookRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { pickup, destination, distance, duration } = req.body;
        const userId = req.user._id;

        const ride = await rideService.createRide({
            userId,
            pickup,
            destination,
            distance,
            duration
        });

        res.status(201).json({
            message: 'Ride booked successfully ✅',
            ride
        });
    } catch (error) {
        console.error('Error booking ride:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const acceptRide = async (req, res) => {
    try {
        const { rideId } = req.body;
        const captainId = req.captain._id;

        if (!rideId) {
            return res.status(400).json({ message: 'Ride ID is required' });
        }

        // Check if ride is already accepted
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        if (ride.status !== 'requested') {
            return res.status(400).json({ message: 'Ride is no longer available' });
        }

        const updatedRide = await rideService.acceptRide(rideId, captainId);

        res.status(200).json({
            message: 'Ride accepted successfully ✅',
            ride: updatedRide
        });
    } catch (error) {
        console.error('Error accepting ride:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const completeRide = async (req, res) => {
    try {
        const { rideId, otp } = req.body;

        if (!rideId || !otp) {
            return res.status(400).json({ message: 'Ride ID and OTP are required' });
        }

        const completedRide = await rideService.completeRide(rideId, otp);

        res.status(200).json({
            message: 'Ride completed successfully ✅',
            ride: completedRide
        });
    } catch (error) {
        console.error('Error completing ride:', error);
        res.status(400).json({ message: error.message });
    }
};

export const cancelRide = async (req, res) => {
    try {
        const { rideId } = req.body;

        if (!rideId) {
            return res.status(400).json({ message: 'Ride ID is required' });
        }

        const cancelledRide = await rideService.cancelRide(rideId);

        res.status(200).json({
            message: 'Ride cancelled successfully ✅',
            ride: cancelledRide
        });
    } catch (error) {
        console.error('Error cancelling ride:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getRideById = async (req, res) => {
    try {
        const { rideId } = req.params;

        if (!rideId) {
            return res.status(400).json({ message: 'Ride ID is required' });
        }

        const ride = await rideService.getRideById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json({ ride });
    } catch (error) {
        console.error('Error fetching ride:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserRides = async (req, res) => {
    try {
        const userId = req.user._id;
        const rides = await rideService.getUserRides(userId);

        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching user rides:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getCaptainRides = async (req, res) => {
    try {
        const captainId = req.captain._id;
        const rides = await rideService.getCaptainRides(captainId);

        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching captain rides:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableRides = async (req, res) => {
    try {
        const rides = await rideService.getAvailableRides();

        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error fetching available rides:', error);
        res.status(500).json({ message: error.message });
    }
};

export const rateRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rideId, captainId, rating, comment } = req.body;
        const userId = req.user._id;

        const ratingRecord = await rideService.rateRide({
            rideId,
            userId,
            captainId,
            rating,
            comment
        });

        res.status(201).json({
            message: 'Rating submitted successfully ✅',
            rating: ratingRecord
        });
    } catch (error) {
        console.error('Error rating ride:', error);
        res.status(400).json({ message: error.message });
    }
};

export const getCaptainRating = async (req, res) => {
    try {
        const { captainId } = req.params;

        if (!captainId) {
            return res.status(400).json({ message: 'Captain ID is required' });
        }

        const rating = await rideService.getCaptainRating(captainId);

        res.status(200).json({ rating });
    } catch (error) {
        console.error('Error fetching captain rating:', error);
        res.status(500).json({ message: error.message });
    }
};

export default {
    bookRide,
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
