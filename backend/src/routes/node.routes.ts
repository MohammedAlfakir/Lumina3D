import { Router } from "express";
import { createNode, getProductNodes } from "../controllers/node.controller.js";

const router = Router();

// POST /api/nodes -> Create a new configuration zone
router.post("/", createNode);

// GET /api/nodes/:productId -> Get all configuration zones for a specific product
router.get("/:productId", getProductNodes);

export default router;
