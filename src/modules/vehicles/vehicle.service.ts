import { pool } from "../../config/db";

interface VehiclePayload {
  vehicle_name?: string;
  type?: "car" | "bike" | "van" | "SUV";
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: "available" | "booked";
}

// Create new vehicle
const createVehicle = async (payload: VehiclePayload) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status || "available"]
  );

  return result;
};

// Get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

// Get single vehicle by ID
const getVehicleById = async (id: string) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [id]
  );
  return result;
};

// Update vehicle dynamically
const updateVehicle = async (id: string, payload: VehiclePayload) => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key in payload) {
    if ((payload as any)[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push((payload as any)[key]);
      idx++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id); 
  const query = `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

  const result = await pool.query(query, values);
  return result;
};

// Delete vehicle
const deleteVehicle = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1`,
    [id]
  );
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
