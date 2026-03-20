import { Router } from "express";
import { createMaterialOption } from "../controllers/material.controller.js";

const router = Router();

// POST /api/materials -> Add a new color/texture choice to a node
router.post("/", createMaterialOption);

export default router;
