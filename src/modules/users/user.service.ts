import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

interface UserPayload {
  name: string;
  role: string;
  email: string;
  password: string;
  phone?: string;
}

// Create new user
const createUser = async (payload: UserPayload) => {
  const { name, role, email, password, phone } = payload;

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, phone) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, role, email, hashedPass, phone || null]
  );

  return result;
};

// Get all users
const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users ORDER BY id ASC`);
  return result;
};

// Get single user by ID
const getSingleUser = async (id: string) => {
  if (!id) throw new Error("User ID is required");
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result;
};

// Update user
const updateUser = async (id: string, payload: Partial<UserPayload>) => {
  if (!id) throw new Error("User ID is required");

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
  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

  const result = await pool.query(query, values);
  return result;
};

// Delete user
const deleteUser = async (id: string) => {
  if (!id) throw new Error("User ID is required");
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  );
  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
