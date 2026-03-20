import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createNode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { productId, meshName, displayName, order } = req.body;

    // Validation
    if (!productId || !meshName || !displayName) {
      res
        .status(400)
        .json({ error: "productId, meshName, and displayName are required" });
      return;
    }

    // Create the Node
    const newNode = await prisma.configurableNode.create({
      data: {
        // Explicitly cast to String to satisfy TypeScript
        productId: String(productId),
        meshName: String(meshName),
        displayName: String(displayName),
        order: Number(order) || 0,
      },
    });

    res.status(201).json(newNode);
  } catch (error: any) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({
          error:
            "A configuration node for this mesh name already exists on this product",
        });
      return;
    }
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getProductNodes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Explicitly cast req.params.productId as a string
    const productId = req.params.productId as string;

    if (!productId) {
      res.status(400).json({ error: "productId is required in the URL" });
      return;
    }

    const nodes = await prisma.configurableNode.findMany({
      where: {
        productId: productId, // Now TypeScript knows this is 100% a string
      },
      orderBy: { order: "asc" },
      include: {
        options: true,
      },
    });

    res.status(200).json(nodes);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
