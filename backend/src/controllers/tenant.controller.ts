import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js"; // Notice the .js extension!

export const createTenant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      res.status(400).json({ error: "Name and domain are required" });
      return;
    }

    const newTenant = await prisma.tenant.create({
      data: { name, domain },
    });

    res.status(201).json(newTenant);
  } catch (error: any) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ error: "A tenant with this domain already exists" });
      return;
    }
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getTenants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: { products: true },
    });
    res.status(200).json(tenants);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
