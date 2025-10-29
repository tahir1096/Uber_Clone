import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins
  socket.on("user-join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // Captain joins
  socket.on("captain-join", (captainId) => {
    socket.join(captainId);
    console.log(`🚗 Captain ${captainId} joined with socket ${socket.id}`);
  });

  // Live location updates from captain
  socket.on("captain-location", (data) => {
    const { captainId, lat, lng, rideId } = data;
    if (rideId) {
      io.to(rideId).emit("captain-location-update", {
        lat,
        lng,
        captainId
      });
    }
  });

  // Ride request notification
  socket.on("ride-request", (data) => {
    io.to(`captain-${data.vehicleType}`).emit("new-ride-request", data);
  });

  // Ride acceptance
  socket.on("ride-accepted", (data) => {
    io.to(data.userId).emit("ride-accepted-notification", data);
    socket.join(data.rideId);
  });

  // Ride started
  socket.on("ride-started", (data) => {
    io.to(data.rideId).emit("ride-started-notification", data);
  });

  // Ride completed
  socket.on("ride-completed", (data) => {
    io.to(data.rideId).emit("ride-completed-notification", data);
  });

  // Ride cancelled
  socket.on("ride-cancelled", (data) => {
    io.to(data.rideId).emit("ride-cancelled-notification", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
