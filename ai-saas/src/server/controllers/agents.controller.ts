import { db } from "@/db";
import { agents } from "@/db/schema";

import { eq } from "drizzle-orm";

import { Request, Response } from "express";
import { agentInsertSchema } from "@/modules/agents/schema";

export const getAgents = async (req: Request, res: Response) => {

  try {
    const data = await db.select().from(agents).where(eq(agents.userId, req.user.id));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
};



export const createAgents = async (req: Request, res: Response) => {
    try {
        const input = agentInsertSchema.parse(req.body); // 🔥 REAL SECURITY
        const [data] = await db.insert(agents).values({
            name: input.name,
            instructions: input.instruction,
            userId: req.user.id,
        }).returning();
        res.json(data);
        } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Failed to create agent",
        });
    }
}
