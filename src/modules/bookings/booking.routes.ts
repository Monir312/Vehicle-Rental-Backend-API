import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth("admin", "customer"),
  bookingControllers.createBooking
);

router.get(
  "/",
  auth("admin", "customer"),
  bookingControllers.getBookings
);

router.get(
  "/:id",
  auth("admin", "customer"),
  bookingControllers.getBookingById
);

router.put(
  "/:id",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

// Delete booking (Admin only)
router.delete(
  "/:id",
  auth("admin"),
  bookingControllers.deleteBooking
);

export const bookingRoutes = router;
