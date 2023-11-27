import { z } from "zod";

const GeoPointDTOSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ActivityEditSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  description: z.string(),
  duration: z.string(),
  location: z.string(),
  geoLocation: GeoPointDTOSchema.optional(),
});

export const ActivitySchema = ActivityEditSchema.merge(
  z.object({
    id: z.string(),
    organizationId: z.string(),
  })
);

export const ActivityListSchema = z.array(ActivitySchema);

export type ActivityEdit = z.infer<typeof ActivityEditSchema>;
