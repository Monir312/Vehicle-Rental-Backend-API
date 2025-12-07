import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

// Create a new vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    const result = await vehicleServices.createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create vehicle",
    });
  }
};

// Get all vehicles
const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch vehicles",
    });
  }
};

// Get single vehicle by ID
const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.id;
    if (!vehicleId) {
      return res.status(400).json({ success: false, message: "Vehicle ID is required" });
    }

    const result = await vehicleServices.getVehicleById(vehicleId);

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch vehicle",
    });
  }
};

// Update vehicle
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const updateVehicleId = req.params.id;
    if (!updateVehicleId) {
      return res.status(400).json({ success: false, message: "Vehicle ID is required" });
    }

    const result = await vehicleServices.updateVehicle(updateVehicleId, payload);

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update vehicle",
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const deleteVehicleId = req.params.id;
    if (!deleteVehicleId) {
      return res.status(400).json({ success: false, message: "Vehicle ID is required" });
    }

    const result = await vehicleServices.deleteVehicle(deleteVehicleId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete vehicle",
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
