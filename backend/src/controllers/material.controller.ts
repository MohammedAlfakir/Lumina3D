import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createMaterialOption = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nodeId, name, colorHex, textureUrl, priceModifier, isDefault } =
      req.body;

    // Validation
    if (!nodeId || !name) {
      res.status(400).json({ error: "nodeId and name are required" });
      return;
    }

    // Create the Material Option
    const newMaterial = await prisma.materialOption.create({
      data: {
        nodeId,
        name,
        colorHex: colorHex || null,
        textureUrl: textureUrl || null,
        priceModifier: priceModifier ? parseFloat(priceModifier) : 0.0,
        isDefault: isDefault || false,
      },
    });

    // If this new material is set as default, we might want to unset other defaults for this node
    // (Optional advanced logic, but good for robust APIs)
    if (isDefault) {
      await prisma.materialOption.updateMany({
        where: {
          nodeId: nodeId,
          id: { not: newMaterial.id }, // Update all OTHERS
        },
        data: { isDefault: false },
      });
    }

    res.status(201).json(newMaterial);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
