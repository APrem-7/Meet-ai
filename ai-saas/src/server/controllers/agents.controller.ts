import { db } from '@/db';
import { agents } from '@/db/schema';

import { eq } from 'drizzle-orm';

import { Request, Response } from 'express';
import { agentInsertSchema } from '@/modules/agents/schema';

import { redis } from '@/lib/redis';

export const getAgents = async (req: Request, res: Response) => {
  try {
    const cacheKey = `agents:${req.user.id}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`🎯 Cache HIT for agents:`, req.user.id);
      // Data is in cache, return it
      return res.json(cachedData);
    }
    console.log(`❌ Cache MISS for agents:`, req.user.id);
    console.log('🗄️ Querying database...');
    const data = await db
      .select({
        id: agents.id,
        name: agents.name,
        instructions: agents.instructions,
      })
      .from(agents)
      .where(eq(agents.userId, req.user.id));
    console.log(`📊 Found ${data.length} agents`);
    await redis.set(cacheKey, data, 300); //If not in the cache Set it in the cache
    console.log('💾 Cache SET for agents:', req.user.id);
    return res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
};

export const createAgents = async (req: Request, res: Response) => {
  try {
    const cacheKey = `agents:${req.user.id}`;
    const input = agentInsertSchema.parse(req.body); // 🔥 REAL SECURITY
    const [data] = await db
      .insert(agents)
      .values({
        name: input.name,
        instructions: input.instruction,
        userId: req.user.id,
      })
      .returning();

    console.log(`🧹 Cache invalidated for agents:`, req.user.id);
    await redis.del(cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Failed to create agent',
    });
  }
};
