import express from "express";
import cors from "cors";
import connectDB from './db/db.js';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.routes.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/user", userRoutes);

export default app;
