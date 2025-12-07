import { Request, Response } from "express";
import { userServices } from "./user.service";

// Create new user
const createUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await userServices.createUser(payload);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create user",
    });
  }
};

// Get all users
const getUser = async (_req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch users",
    });
  }
};

// Get single user
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("User ID is required");

    const result = await userServices.getSingleUser(id);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch user",
    });
  }
};

// Update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("User ID is required");

    const payload = req.body;
    const result = await userServices.updateUser(id, payload);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update user",
    });
  }
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("User ID is required");

    const result = await userServices.deleteUser(id);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to delete user" });
  }
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
