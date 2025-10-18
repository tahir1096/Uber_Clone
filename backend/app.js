import express from "express";
import cors from "cors";
import connectDB from './db/db.js';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.routes.js';

const app = express();
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Basic route
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API is working fine!");
});

export default app;
