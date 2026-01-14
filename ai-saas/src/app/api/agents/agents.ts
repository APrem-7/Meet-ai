import { agentInsertSchema } from '@/modules/agents/schema';
import z from 'zod';

export const fetchAgents = async (page: number, pageSize: number) => {
  console.log('🌐 Fetching agents from backend API...');
  console.log(` Page: ${page || 1}, PageSize: ${pageSize || 10}`);
  const url = new URL('http://localhost:8000/agents');

  if (page) {
    url.searchParams.set('page', page.toString());
  }
  if (pageSize) {
    url.searchParams.set('pageSize', pageSize.toString());
  }
  console.log(`📡 Making GET request to: ${url.toString()}`);
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`❌ Failed to fetch agents: ${res.status}`);
    throw new Error(`Failed to fetch agents: ${res.status}`);
  }
  const res_data = await res.json();
  console.log('✅ Successfully fetched agents:', res_data);
  return res_data;
};

export const SearchAgents = async (search?: string) => {
  console.log('🌐 Fetching agents from backend API...');
  console.log(`🔍 Search parameter: ${search || 'none'}`);
  const url = new URL('http://localhost:8000/agents');
  if (search) {
    url.searchParams.set('search', search);
  }
  console.log(`📡 Making GET request to: ${url.toString()}`);
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`❌ Failed to fetch agents: ${res.status}`);
    throw new Error(`Failed to fetch agents: ${res.status}`);
  }
  const res_data = await res.json();
  console.log('✅ Successfully fetched agents:', res_data);
  return res_data;
};

export const createAgent = async (input: z.infer<typeof agentInsertSchema>) => {
  console.log('🌐 Creating new agent via backend API...');
  console.log('📝 Input data:', input);
  const input_data = agentInsertSchema.parse(input); // 👈 REAL SECURITY
  console.log('✅ Input validation passed');
  console.log('📡 Making POST request to: http://localhost:8000/agents');
  const res = await fetch('http://localhost:8000/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT for cookies/session
    body: JSON.stringify(input_data),
  });

  if (!res.ok) {
    console.error(`❌ Failed to create agent: ${res.status}`);
    throw new Error(`Failed to create agent: ${res.status}`);
  }

  const result = await res.json();
  console.log('✅ Successfully created agent:', result);
  return result;
};

export const getOneAgent = async (agentId: string) => {
  const res = await fetch(`http://localhost:8000/agents/${agentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT for cookies/session
  });

  if (!res.ok) {
    console.error(`❌ Failed to get ${agentId} agent: ${res.status}`);
    throw new Error(`Failed to get ${agentId} agent: ${res.status}`);
  }

  const result = await res.json();
  console.log('✅ Successfully fetched agent:', result);
  return result;
};
