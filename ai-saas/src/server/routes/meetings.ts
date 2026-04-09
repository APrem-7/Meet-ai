import express from 'express';

import { requireAuth } from '@/server/middleware/auth-middleware';

import {
  getMeetings,
  getOneMeeting,
  createMeetings,
  deleteMeeting,
  updateMeeting,
  generateMeetingToken,
} from '../controllers/meetings.controller';

import {
  autoConnectAgent,
  disconnectAIAgent,
  getAgentStatus,
} from '../controllers/agent-realtime.controller';

const router = express.Router();

// --- Meeting CRUD routes ---

router.get('/', requireAuth, getMeetings);
router.get('/:meetingId', requireAuth, getOneMeeting);
router.post('/', requireAuth, createMeetings);
router.delete('/:meetingId', requireAuth, deleteMeeting);
router.put('/:meetingId', requireAuth, updateMeeting);
router.post('/token', requireAuth, generateMeetingToken);

// --- AI Agent routes ---

router.post('/:meetingId/agent/auto-connect', requireAuth, async (req, res) => {
  const { meetingId } = req.params;
  await autoConnectAgent(meetingId, req, res);
});

router.post('/:meetingId/agent/disconnect', requireAuth, async (req, res) => {
  const { meetingId } = req.params;
  await disconnectAIAgent(meetingId, req, res);
});

router.get('/:meetingId/agent/status', requireAuth, async (req, res) => {
  const { meetingId } = req.params;
  await getAgentStatus(meetingId, req, res);
});

export default router;
