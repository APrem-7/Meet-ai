import { db } from '@/db';
import { agents } from '@/db/schema';

import { eq, ilike, count, and } from 'drizzle-orm';

import { Request, Response } from 'express';
import { agentInsertSchema } from '@/modules/agents/schema';
import { paginationSchema } from '@/modules/agents/pagination-schema';

import { redis } from '@/lib/redis';

export const getAgents = async (req: Request, res: Response) => {
  console.log('📋 GET /agents endpoint hit');
  console.log(`👤 User ID: ${req.user.id}`);
  console.log(`🔍 Search query: ${req.query.search || 'none'}`);
  try {
    // Validate and parse query parameters using pagination schema
    const validatedQuery = paginationSchema.parse({
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      search: req.query.search,
    });

    const { page: pageNum, pageSize: pageSizeNum, search } = validatedQuery;

    const cacheKey = `agents:${req.user.id}:${
      search || 'all'
    }:${pageNum}:${pageSizeNum}`;

    console.log(`💾 Checking cache for key: ${cacheKey}`);
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('🎯 Cache HIT - returning cached agents data');
      // Data is in cache, return it
      return res.json(cachedData);
    }

    console.log('❌ Cache MISS - fetching from database');

    const offset = (pageNum - 1) * pageSizeNum;

    console.log(
      `📄 Page: ${pageNum}, PageSize: ${pageSizeNum}, Offset: ${offset}`
    );
    console.log('🗄️ Querying database for agents...');

    const data = await db
      .select({
        id: agents.id,
        name: agents.name,
        instructions: agents.instructions,
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, req.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      )
      .limit(pageSizeNum)
      .offset(offset);

    console.log(`📊 Found agents:`, data);
    console.log(`📊 Data type: ${typeof data}`);
    console.log(`📊 Is array? ${Array.isArray(data)}`);
    console.log(`📊 Data length: ${data.length}`);
    console.log(`📊 First item:`, data[0]);

    console.log('🔢 Counting total agents for pagination...');
    const [total] = await db
      .select({
        count: count(),
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, req.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      );
    console.log(`📈 Total agents count: ${total.count}`);

    const totalPage = Math.ceil(total.count / pageSizeNum);
    console.log(`📄 Total pages: ${totalPage}`);
    console.log('💾 Setting cache with 300s TTL for key: ${cacheKey}');
    const responseData = {
      data: data,
      totalPages: totalPage,
      totalAgents: total.count,
      currentPage: pageNum,
      pageSize: pageSizeNum,
    };
    await redis.set(cacheKey, responseData, 300); //If not in the cache Set it in the cache

    console.log('✅ Successfully fetched and cached agents data');
    console.log('🔍 Response data structure:', {
      data: data,
      totalPages: totalPage,
      totalAgents: total.count,
      currentPage: pageNum,
      pageSize: pageSizeNum,
    });
    return res.json(responseData);
  } catch (error) {
    console.error('❌ Error in getAgents:', error);
    return res.status(500).json({ message: 'Failed to fetch agents' });
  }
};

export const createAgents = async (req: Request, res: Response) => {
  console.log('➕ POST /agents endpoint hit');
  console.log(`👤 User ID: ${req.user.id}`);
  console.log('📝 Request body:', req.body);
  try {
    console.log('🔍 Validating input with schema...');
    const input = agentInsertSchema.parse(req.body); // 🔥 REAL SECURITY
    console.log('✅ Input validation passed');
    console.log('💾 Inserting new agent into database...');
    const [data] = await db
      .insert(agents)
      .values({
        name: input.name,
        instructions: input.instruction,
        userId: req.user.id,
      })
      .returning();
    console.log(`✅ Successfully created agent with ID: ${data.id}`);
    console.log(
      `🗑️ Invalidating all agent search caches for user ${req.user.id}`
    );
    const pattern = `agents:${req.user.id}:*`;
    await redis.invalidate(pattern);

    console.log('✅ Agent creation complete');
    return res.json(data) || { message: 'Failed to create agent' };
  } catch (error) {
    console.error('❌ Error in createAgents:', error);
    return res.status(500).json({
      message: 'Failed to create agent',
    });
  }
};
