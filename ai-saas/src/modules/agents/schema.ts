import { z } from 'zod';

export const agentSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  model: z.string().min(1, { message: 'Name is required' }),
});
