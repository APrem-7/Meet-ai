import { z } from 'zod';

const DEFAULT_INSTRUCTION = "You are a helpful AI assistant.";

export const agentInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  instruction: z
    .string()
    .trim()
    .min(1, { message: 'Instruction is required' })
    .default(DEFAULT_INSTRUCTION),
});
