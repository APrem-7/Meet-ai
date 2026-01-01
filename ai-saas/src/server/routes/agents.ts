import express from 'express';

import { requireAuth } from '@/server/middleware/auth-middleware';
import { getAgents, createAgent } from '../controllers/agents.controller';

const router = express.Router();

router.get('/', getAgents); // public
//router.post("/", requireAuth, createAgent);    // protected

export default router;
