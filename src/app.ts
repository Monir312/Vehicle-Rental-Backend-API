import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";

// Modules imports
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

// Initialize Database
initDB();

// Base route
app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental API is running...");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);


// 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
