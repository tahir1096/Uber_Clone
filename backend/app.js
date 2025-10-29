import express from "express";
import cors from "cors";
import connectDB from './db/db.js';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.routes.js';
import captainRoutes from './routes/captain.routes.js';
import rideRoutes from './routes/ride.routes.js';
const app = express();
connectDB();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/user", userRoutes);
app.use('/captain', captainRoutes);
app.use('/ride', rideRoutes);


export default app;