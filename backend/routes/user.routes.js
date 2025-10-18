import express from "express";
import { body } from "express-validator";
import { registerUser } from "../controllers/user.controller.js";
const router = express.Router();

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
  registerUser // ✅ use the correct function name
);

export default router;
