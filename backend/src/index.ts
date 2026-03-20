import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import tenantRoutes from "./routes/tenant.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tenants", tenantRoutes);
app.use("/api/products", productRoutes);

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "Lumina3D API is running flawlessly" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});
