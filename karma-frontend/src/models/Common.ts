import { z } from "zod";

export const HasIDSchema = z.object({ id: z.string().uuid() });

export const VoidSchema = z.void();

export const EmptySchema = z.string();

export const ValidationResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string().optional().nullable(),
});
