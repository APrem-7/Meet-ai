import express from 'express';

import { requireAuth } from '@/server/middleware/auth-middleware';

import {
  getMeetings,
  getOneMeeting,
  createMeetings,
  deleteMeeting,
  updateMeeting,
} from '../controllers/meetings.controller';

const router = express.Router();

console.log('🛤️ Setting up meetings routes...');

router.get(
  '/',
  requireAuth,
  (req, res, next) => {
    console.log('📋 GET /meetings route matched');
    next();
  },
  getMeetings
); // protected to show only the users agents not all agents

router.get(
  '/:meetingId',
  requireAuth,
  (req, res, next) => {
    console.log('📋 GET /meeting route matched');
    next();
  },
  getOneMeeting
); // protected to show only the users selected agent not all agents

router.post(
  '/',
  requireAuth,
  (req, res, next) => {
    console.log('➕ POST /meetings route matched');
    next();
  },
  createMeetings
);
//router.post("/", requireAuth, createAgent);    // protected

router.delete(
  '/:meetingId',
  requireAuth,
  (req, res, next) => {
    console.log('➕ DELETE /meeting route matched');
    next();
  },
  deleteMeeting
);

router.put(
  '/:meetingId',
  requireAuth,
  (req, res, next) => {
    console.log('➕ PUT/UPDATE /meeting route matched');
    next();
  },
  updateMeeting
);

console.log('✅ Meetings routes configured');
export default router;
