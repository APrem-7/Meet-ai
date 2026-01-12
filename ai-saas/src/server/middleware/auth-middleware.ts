import { Request, Response, NextFunction } from 'express';
import { auth } from '@/lib/auth';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🔐 Authentication middleware triggered');
  console.log(`🌐 Request path: ${req.path}`);
  console.log(`📋 Request method: ${req.method}`);

  const headers = new Headers();
  console.log('📤 Processing request headers...');

  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }
  console.log('📋 Headers processed for auth check');

  try {
    console.log('🔍 Checking session with auth service...');
    const session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      console.log('❌ Authentication failed - no session or user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(`✅ Authentication successful for user: ${session.user.id}`);
    req.user = session.user;
    next();
  } catch (err) {
    console.error('❌ Authentication error:', err);
    next(err);
  }
};
