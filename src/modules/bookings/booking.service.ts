import { pool } from "../../config/db";

export interface BookingPayload {
  customer_id?: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price?: number;
  status?: "active" | "cancelled" | "returned";
}

// Create a booking
const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
  if (!vehicleResult.rows.length) throw new Error("Vehicle not found");

  const vehicle = vehicleResult.rows[0];
  if (vehicle.availability_status === "booked") throw new Error("Vehicle is already booked");

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  if (end < start) throw new Error("End date must be after start date");

  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const total_price = duration * vehicle.daily_rent_price;

  const bookingResult = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );


  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

  return bookingResult;
};

const getAllBookings = async () => {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY rent_start_date DESC`);
  return result;
};

const getBookingsByCustomer = async (customer_id: number) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 ORDER BY rent_start_date DESC`,
    [customer_id]
  );
  return result;
};

// Get single booking by ID
const getBookingById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  return result;
};

// Update booking
const updateBooking = async (id: string, payload: Partial<BookingPayload>) => {
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

  if (!fields.length) throw new Error("No fields to update");

  values.push(id);
  const query = `UPDATE bookings SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`;
  const result = await pool.query(query, values);

  if (payload.status === "cancelled" || payload.status === "returned") {
    const booking = result.rows[0];
    await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [
      booking.vehicle_id,
    ]);
  }

  return result;
};

// Delete booking
const deleteBooking = async (id: string) => {
  const result = await pool.query(`DELETE FROM bookings WHERE id=$1`, [id]);
  return result;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  getBookingsByCustomer,
  getBookingById,
  updateBooking,
  deleteBooking,
};
