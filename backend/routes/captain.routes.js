import express from "express";
import { body } from "express-validator";
import authMiddleware from '../middlewares/auth.middleware.js'
import captainController from '../controllers/captain.controller.js'
const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 2 }).withMessage('Vehicle color must be at least 2 characters long'),
    body('vehicle.plateNumber').isLength({ min: 5 }).withMessage('Plate number must be at least 5 characters long'),
    body('vehicle.seatingCapacity').isInt({ min: 1 }).withMessage('Seating capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['bike', 'car', 'auto-rikshaw']).withMessage('Invalid vehicle type'),
    body('vehicle.model').isLength({ min: 2 }).withMessage('Vehicle model must be at least 2 characters long'),
    

], 
captainController.registerCaptain
)
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
],
captainController.loginCaptain
)

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)
router.post('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)
export default router;