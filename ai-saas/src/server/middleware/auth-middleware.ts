import { Request, Response, NextFunction } from 'express';
import { auth } from '@/lib/auth';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }

  try {
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.auth = session;
    next();
  } catch (err) {
    next(err);
  }
};
