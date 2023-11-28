import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { FeedbackEditSchema, FeedbackSchema } from "../models/Feedback";
import { EmptySchema, VoidSchema } from "../models/Common";

export const updateFeedback = api<
  z.infer<typeof FeedbackEditSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string; feedbackId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/events/:activityId/feedbacks/:feedbackId",
  requestSchema: FeedbackEditSchema,
  responseSchema: EmptySchema,
});

export const createFeedback = api<
  z.infer<typeof FeedbackEditSchema>,
  z.infer<typeof FeedbackSchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.POST,
  path: "/organizations/:organizationId/events/:activityId/feedbacks",
  requestSchema: FeedbackEditSchema,
  responseSchema: FeedbackSchema,
});

export const deleteFeedback = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string; feedbackId: string }
>({
  method: HTTPMethod.DELETE,
  path: "/organizations/:organizationId/events/:activityId/feedbacks/:feedbackId",
  requestSchema: VoidSchema,
  responseSchema: EmptySchema,
});
