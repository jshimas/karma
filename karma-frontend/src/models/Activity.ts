import { z } from "zod";
import { FeedbackListSchema } from "./Feedback";

const GeoPointDTOSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ActivityEditSchema = z.object({
  name: z.string().min(1, "Name is required."),
  startDate: z
    .string()
    .min(1, "Start date is required.")
    .refine(
      (date) => new Date(date) > new Date(),
      "Past dates are not allowed!"
    ),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Please describe the expected duration."),
  location: z.string().min(1, "Please provivide an address."),
  geoLocation: GeoPointDTOSchema.optional().nullable(),
});

export const ActivitySchema = ActivityEditSchema.merge(
  z.object({
    id: z.string(),
    startDate: z.string().transform((date) => date.split("T")[0]),
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
export type Activity = z.infer<typeof ActivitySchema>;
