import { db } from "@/db";
import { agents } from "@/db/schema";
import { Request, Response } from "express";

export const getAgents = async (req: Request, res: Response) => {
  await setTimeout(() => {}, 3000); // simulate network delay
  try {
    const data = await db.select().from(agents);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
};

export const createAgents = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create agent" });
  }
};
