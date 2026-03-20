import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { uploadModelToSupabase } from "../services/storage.service.js";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Extract standard text fields from the multipart form
    const { name, basePrice, tenantId } = req.body;

    // 2. Extract the file intercepted by Multer
    const file = req.file;

    // Validation
    if (!name || !basePrice || !tenantId) {
      res
        .status(400)
        .json({ error: "Name, basePrice, and tenantId are required" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "A 3D model file (.glb) is required" });
      return;
    }

    // Optional: Validate file extension
    if (!file.originalname.toLowerCase().endsWith(".glb")) {
      res
        .status(400)
        .json({ error: "Only .glb files are supported for WebGL performance" });
      return;
    }

    // 3. Upload to Supabase Bucket
    const fileUrl = await uploadModelToSupabase(
      file.buffer,
      file.originalname,
      tenantId,
    );

    // Calculate file size in MB for the frontend loading screens
    const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));

    // 4. Save to Database using Prisma Nested Writes
    const newProduct = await prisma.product.create({
      data: {
        name,
        basePrice: parseFloat(basePrice),
        tenantId,
        // This automatically creates the ModelAsset row and links it to this Product!
        modelAsset: {
          create: {
            fileUrl,
            fileSizeMb,
          },
        },
      },
      include: {
        modelAsset: true, // Tell Prisma to return the asset data in the API response
      },
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error in createProduct:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
