import express from "express";

import { requireAuth } from "@/server/middleware/auth-middleware";
import { getAgents, createAgents } from "../controllers/agents.controller";

const router = express.Router();

router.get("/", requireAuth,getAgents);  // protected to show only the users agents not all agents
router.post("/", requireAuth,createAgents);                  
//router.post("/", requireAuth, createAgent);    // protected

export default router;
