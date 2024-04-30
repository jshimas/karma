import { z } from "zod";

export const FeedbackEditSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export const FeedbackSchema = FeedbackEditSchema.merge(
  z.object({
    id: z.string(),
    activityId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    userId: z.string(),
    updatedAt: z.coerce.date(),
  })
);

export const FeedbackListSchema = z.array(FeedbackSchema);

export type FeedbackEdit = z.infer<typeof FeedbackEditSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
