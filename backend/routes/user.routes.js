import express from "express";
import { body } from "express-validator";
import { registerUser } from "../controllers/user.controller.js";
import * as useController from '../controllers/user.controller.js'
const router = express.Router();
import authMiddleware from '../middlewares/auth.middleware.js'


router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email address"),
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("lastname")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  registerUser
);

router.post('/login',
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  useController.loginUser
)

router.get('/profile', authMiddleware.authUser, useController.getUserProfile)
router.post('/logout', authMiddleware.authUser, useController.logoutUser)


export default router;
