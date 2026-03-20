import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import tenantRoutes from "./routes/tenant.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tenants", tenantRoutes);

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "Lumina3D API is running flawlessly" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});
