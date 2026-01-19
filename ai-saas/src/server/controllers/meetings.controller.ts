import { db } from '@/db';
import { meetings, meetingStatus } from '@/db/schema';

import { eq, ilike, count, and } from 'drizzle-orm';

import { Request, Response } from 'express';

import { paginationSchema } from '@/modules/agents/pagination-schema';

import { redis } from '@/lib/redis';

import { meetingInsertSchema } from '@/modules/meetings/schema';

export const getMeetings = async (req: Request, res: Response) => {
  // console.log('📋 GET /meetings endpoint hit');
  // console.log(`👤 User ID: ${req.user.id}`);
  // console.log(`🔍 Search query: ${req.query.search || 'none'}`);

  try {
    // Validate and parse query parameters using pagination schema
    const validatedQuery = paginationSchema.parse({
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      search: req.query.search,
    });

    const { page: pageNum, pageSize: pageSizeNum, search } = validatedQuery;

    const cacheKey = `meetings:${req.user.id}:${
      search || 'all'
    }:${pageNum}:${pageSizeNum}`;

    // console.log(`💾 Checking cache for key: ${cacheKey}`);
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // console.log('🎯 Cache HIT - returning cached meetings data');
      // Data is in cache, return it
      return res.json(cachedData);
    }

    // console.log('❌ Cache MISS - fetching from database');

    const offset = (pageNum - 1) * pageSizeNum;

    // console.log(
    //   `📄 Page: ${pageNum}, PageSize: ${pageSizeNum}, Offset: ${offset}`
    // );
    // console.log('🗄️ Querying database for meetings...');

    const data = await db
      .select({
        id: meetings.id,
        name: meetings.name,
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, req.user.id),
          search ? ilike(meetings.name, `%${search}%`) : undefined
        )
      )
      .limit(pageSizeNum)
      .offset(offset);

    // console.log(`📊 Found meetings:`, data);
    // console.log(`📊 Data type: ${typeof data}`);
    // console.log(`📊 Is array? ${Array.isArray(data)}`);
    // console.log(`📊 Data length: ${data.length}`);
    // console.log(`📊 First item:`, data[0]);

    // console.log('🔢 Counting total meetings for pagination...');
    const [total] = await db
      .select({
        count: count(),
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, req.user.id),
          search ? ilike(meetings.name, `%${search}%`) : undefined
        )
      );
    // console.log(`📈 Total meetings count: ${total.count}`);

    const totalPage = Math.ceil(total.count / pageSizeNum);
    // console.log(`📄 Total pages: ${totalPage}`);
    // console.log('💾 Setting cache with 300s TTL for key: ${cacheKey}');
    const responseData = {
      data: data,
      totalPages: totalPage,
      totalmeetings: total.count,
      currentPage: pageNum,
      pageSize: pageSizeNum,
    };
    await redis.set(cacheKey, responseData, 300); //If not in the cache Set it in the cache

    // console.log('✅ Successfully fetched and cached meetings data');
    // console.log('🔍 Response data structure:', {
    //   data: data,
    //   totalPages: totalPage,
    //   totalmeetings: total.count,
    //   currentPage: pageNum,
    //   pageSize: pageSizeNum,
    // });
    return res.json(responseData);
  } catch (error) {
    console.error('❌ Error in getmeetings:', error);
    return res.status(500).json({ message: 'Failed to fetch meetings' });
  }
};

