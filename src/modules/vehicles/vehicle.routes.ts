import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.use(logger);


router.post("/", auth("admin"), vehicleControllers.createVehicle);


router.get("/", vehicleControllers.getAllVehicles);


router.get("/:id", vehicleControllers.getVehicleById);

router.put("/:id", auth("admin"), vehicleControllers.updateVehicle);

router.delete("/:id", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
