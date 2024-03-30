import { z } from "zod";

export const ApplicationCreateSchema = z.object({
  userId: z.string().uuid(),
  motivation: z.string({
    required_error: "Please fill in the motivation",
  }),
});

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  activityId: z.string().uuid(),
  motivation: z.string(),
  isApproved: z.boolean(),
  dateOfApplication: z.coerce.date(),
  dateOfApproval: z.coerce.date(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type ApplicationCreate = z.infer<typeof ApplicationCreateSchema>;
