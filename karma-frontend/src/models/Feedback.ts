import { z } from "zod";

export const FeedbackEditSchema = z.object({
  comment: z.string(),
});

export const FeedbackSchema = FeedbackEditSchema.merge(
  z.object({
    id: z.string(),
    activityId: z.string(),
    userId: z.string(),
  })
);

export const FeedbackListSchema = z.array(FeedbackSchema);

export type FeedbackEdit = z.infer<typeof FeedbackEditSchema>;
