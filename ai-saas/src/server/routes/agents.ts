import express from "express";
import { db } from "@/db";
import { agents } from "@/db/schema";

const router = express.Router();

// GET /agents
router.get("/", async (req, res) => {
  try {
    const data = await db
      .select()
      .from(agents);

    res.json(data);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
});

export default router;
