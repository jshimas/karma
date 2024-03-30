import { z } from "zod";
import { FeedbackListSchema } from "./Feedback";

export const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ActivitiesRequestSchema = z.object({
  search: z.string().optional(),
  scopes: z.array(z.string()).optional(),
  distance: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
});

export const GeoPointDTOSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const UserActivityApplicationSchema = z.object({
  motivation: z.string(),
});

export const ActivityEditSchema = z.object({
  name: z.string().min(1, "Please provide a name!"),
  startDate: z
    .date({
      required_error: "Please provide a start date!",
    })
    .refine(
      (date) => new Date(date) > new Date(),
      "Past dates are not allowed!"
    ),
  endDate: z.date({
    required_error: "Please provide an end date!",
  }),
  address: z.string({
    required_error: "Please provivide an address!",
  }),
  scopes: z.array(z.string()).nonempty("Please select at least one scope!"),
  isPublic: z.boolean().default(false),
  description: z
    .string()
    .min(1, "Please let the volunteers what activity is about!"),
  geoLocation: GeoPointDTOSchema.optional().nullable(),
});

export const ActivitySchema = ActivityEditSchema.merge(
  z.object({
    id: z.string(),
    organizationId: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
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
export type GeoLocation = z.infer<typeof GeoPointDTOSchema>;
export type UserActivityApplication = z.infer<
  typeof UserActivityApplicationSchema
>;
export type ActivitiesRequest = z.infer<typeof ActivitiesRequestSchema>;
