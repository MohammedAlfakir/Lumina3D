import { Router } from "express";
import multer from "multer";
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

// Configure Multer to store the file in memory as a Buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Set a strict 50MB limit for performance
});

// The string 'modelFile' is the exact key the frontend must use in its FormData
router.post("/", upload.single("modelFile"), createProduct);

export default router;
