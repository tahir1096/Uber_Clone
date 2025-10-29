import express from 'express';
import { body } from 'express-validator';
import rideController from '../controllers/ride.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// User routes
router.post('/book',
    authMiddleware.authUser,
    [
        body('pickup').notEmpty().withMessage('Pickup location is required'),
        body('pickup.address').isString().withMessage('Pickup address must be a string'),
        body('pickup.latitude').isFloat().withMessage('Pickup latitude must be a number'),
        body('pickup.longitude').isFloat().withMessage('Pickup longitude must be a number'),
        body('destination').notEmpty().withMessage('Destination is required'),
        body('destination.address').isString().withMessage('Destination address must be a string'),
        body('destination.latitude').isFloat().withMessage('Destination latitude must be a number'),
        body('destination.longitude').isFloat().withMessage('Destination longitude must be a number'),
        body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
        body('duration').isInt({ min: 0 }).withMessage('Duration must be a positive integer')
    ],
    rideController.bookRide
);

router.get('/user-rides', authMiddleware.authUser, rideController.getUserRides);
router.get('/:rideId', authMiddleware.authUser, rideController.getRideById);
router.post('/cancel', authMiddleware.authUser, rideController.cancelRide);

router.post('/rate',
    authMiddleware.authUser,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('captainId').notEmpty().withMessage('Captain ID is required'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().isString().withMessage('Comment must be a string')
    ],
    rideController.rateRide
);

// Captain routes
router.post('/accept', authMiddleware.authCaptain, rideController.acceptRide);
router.post('/complete',
    authMiddleware.authCaptain,
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('otp').isString().withMessage('OTP must be provided')
    ],
    rideController.completeRide
);

router.get('/captain-rides', authMiddleware.authCaptain, rideController.getCaptainRides);
router.get('/available-rides', authMiddleware.authCaptain, rideController.getAvailableRides);
router.get('/captain/:captainId/rating', rideController.getCaptainRating);

export default router;
