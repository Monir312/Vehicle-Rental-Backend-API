import express from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";  

const router = express.Router();

router.post("/", logger, userControllers.createUser);

router.get("/", logger, auth("admin"), userControllers.getUser);

router.get("/:id", logger, auth("admin", "customer"), userControllers.getSingleUser);

// Update user (admin or own)
router.put("/:id", logger, auth("admin", "customer"), userControllers.updateUser);

// Delete user (admin only)
router.delete("/:id", logger, auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
