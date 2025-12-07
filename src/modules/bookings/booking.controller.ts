import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

// Create a booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const payload = { ...req.body };


    if (user.role === "customer") {
      payload.customer_id = user.id;
    }

    const result = await bookingServices.createBooking(payload);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create booking",
    });
  }
};

// Get bookings
const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    let result;

    if (user.role === "admin") {
      result = await bookingServices.getAllBookings();
    } else {
      result = await bookingServices.getBookingsByCustomer(user.id);
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch bookings",
    });
  }
};

// Get single booking by ID
const getBookingById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const result = await bookingServices.getBookingById(bookingId);


    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const booking = result.rows[0];

    if (user.role === "customer" && booking.customer_id !== user.id) {
      return res.status(403).json({ success: false, message: "Access forbidden" });
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch booking",
    });
  }
};

// Update booking
const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }
    const payload = { ...req.body };

    const result = await bookingServices.getBookingById(bookingId);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const booking = result.rows[0];

    if (user.role === "customer") {
      const now = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (booking.customer_id !== user.id) {
        return res.status(403).json({ success: false, message: "Access forbidden" });
      }

      if (now > startDate) {
        return res.status(400).json({ success: false, message: "Cannot cancel booking after start date" });
      }

      payload.status = "cancelled";
    } else if (user.role === "admin") {
      payload.status = payload.status || "returned";
    }

    const updated = await bookingServices.updateBooking(bookingId, payload);

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updated.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update booking",
    });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
  try {

    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const result = await bookingServices.deleteBooking(bookingId);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to delete booking" });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
