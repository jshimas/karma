import { z } from "zod";

export const HasIDSchema = z.object({ id: z.string() });

export const VoidSchema = z.void();
