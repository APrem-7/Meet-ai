import {z} from "zod";

const DEFAULT_INSTRUCTION = "You are a helpful AI Video Chatbot.";

export const agentInsertSchema = z.object({
  name: z.string().min(1, {message:"Name is required"}),
  instruction:z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .default(DEFAULT_INSTRUCTION),

});
