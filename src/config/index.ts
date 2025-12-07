import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface Config {
  connection_str: string;
  port: number;
  jwtSecret: string;
}

const config: Config = {
  connection_str: process.env.CONNECTION_STR || "",
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
};

if (!config.connection_str) {
  throw new Error("Database connection string (CONNECTION_STR) is missing in .env");
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env");
}

export default config;
