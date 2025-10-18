import { validationResult } from "express-validator";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    // check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, password } = req.body;

    // hash password before saving
    const hashedPassword = await User.hashPassword(password);

    const user = new User({
      firstname,
      lastname,
      password: hashedPassword,
    });

    await user.save();

    // generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
