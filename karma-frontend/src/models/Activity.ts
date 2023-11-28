import { z } from "zod";
import { FeedbackListSchema } from "./Feedback";

const GeoPointDTOSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ActivityEditSchema = z.object({
  name: z.string(),
  startDate: z.number(),
  description: z.string(),
  duration: z.string(),
  location: z.string(),
  geoLocation: GeoPointDTOSchema.nullable(),
});

export const ActivitySchema = ActivityEditSchema.merge(
  z.object({
    id: z.string(),
    organizationId: z.string(),
  })
);

export const ActivityWithFeedbackSchema = ActivitySchema.merge(
  z.object({
    feedbacks: FeedbackListSchema,
  })
);

export const ActivityListSchema = z.array(ActivitySchema);

export type ActivityEdit = z.infer<typeof ActivityEditSchema>;
