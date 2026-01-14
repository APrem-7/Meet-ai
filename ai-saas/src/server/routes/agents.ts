import express from 'express';

import { requireAuth } from '@/server/middleware/auth-middleware';
import { getAgents, getOneAgent, createAgents } from '../controllers/agents.controller';

const router = express.Router();

console.log('🛤️ Setting up agents routes...');

router.get(
  '/',
  requireAuth,
  (req, res, next) => {
    console.log('📋 GET /agents route matched');
    next();
  },
  getAgents
); // protected to show only the users agents not all agents

router.get(
  '/:agentId',
  requireAuth,
  (req, res, next) => {
    console.log('📋 GET /agent route matched');
    next();
  },
  getOneAgent
); // protected to show only the users selected agent not all agents

router.post(
  '/',
  requireAuth,
  (req, res, next) => {
    console.log('➕ POST /agents route matched');
    next();
  },
  createAgents
);
//router.post("/", requireAuth, createAgent);    // protected

console.log('✅ Agents routes configured');
export default router;
