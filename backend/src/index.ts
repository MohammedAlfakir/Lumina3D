import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Modern way to load dotenv in ESM
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Prisma 7 Adapter using the exact docs method
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
export const prisma = new PrismaClient({ adapter });

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Lumina3D API is running" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
