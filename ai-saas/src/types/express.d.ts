import 'express-serve-static-core';
import { auth } from '@/lib/auth';

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

declare module 'express-serve-static-core' {
  interface Request {
    auth?: Session;
    user?: Session['user'];
  }
}
