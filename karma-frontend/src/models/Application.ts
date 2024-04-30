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
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  activityId: z.string().uuid(),
  motivation: z.string(),
  isApproved: z.boolean().nullable(),
  dateOfApplication: z.coerce.date(),
  dateOfApproval: z.coerce.date().optional().nullable(),
});

export const ApplicationListSchema = z.array(ApplicationSchema);

export const ActivityApplicationRequestSchema = z.object({
  activityId: z.string().uuid(),
});

export const ApplicationEditSchema = z.object({
  isApproved: z.boolean(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type ApplicationList = z.infer<typeof ApplicationListSchema>;
export type ApplicationCreate = z.infer<typeof ApplicationCreateSchema>;
