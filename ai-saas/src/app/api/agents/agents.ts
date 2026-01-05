import { agentInsertSchema } from '@/modules/agents/schema';
import z from 'zod';

export const fetchAgents = async () => {
  const res = await fetch('http://localhost:8000/agents', {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch agents: ${res.status}`);
  }
  return res.json();
};

export const createAgent = async (input: z.infer<typeof agentInsertSchema>) => {
  const input_data = agentInsertSchema.parse(input); // 👈 REAL SECURITY
  const res = await fetch('http://localhost:8000/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT for cookies/session
    body: JSON.stringify(input_data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create agent: ${res.status}`);
  }

  return res.json();
};


