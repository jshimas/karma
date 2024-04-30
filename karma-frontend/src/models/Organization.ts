import { z } from "zod";
import { HasIDSchema } from "./Common";
import { ActivityListSchema } from "./Activity";
import { ParticipationSchema } from "./Participation";
import { AcknowledgementSchema } from "./Acknowledgement";

export const OrganizationEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/,
      "Please provide a valid phone number"
    ),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, "Type is required"),
  mission: z.string().nullish(),
  address: z.string().nullish(),
  website: z
    .string()
    .nullish()
    .refine((value) => !value || value?.indexOf(".") !== -1, {
      message: "Invalid website URL",
    }),
  facebook: z
    .string()
    .nullish()
    .refine((value) => !value || value?.indexOf("facebook") !== -1, {
      message: "Invalid facebook URL",
    }),
  instagram: z
    .string()
    .nullish()
    .refine((value) => !value || value?.indexOf("instagram") !== -1, {
      message: "Invalid instagram URL",
    }),
  youtube: z
    .string()
    .nullish()
    .refine((value) => !value || value?.indexOf("youtube") !== -1, {
      message: "Invalid youtube URL",
    }),
  linkedin: z
    .string()
    .nullish()
    .refine((value) => !value || value?.indexOf("linkedin") !== -1, {
      message: "Invalid linkedin URL",
    }),
  image: z.instanceof(File).optional(),
});

const VolunteerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  scopes: z.array(z.string()),
  participations: z.array(ParticipationSchema).nullable(),
  acknowledgements: z.array(AcknowledgementSchema).nullable(),
});

export const VolunteerListRequestSchema = z.object({
  activityId: z.string().uuid().optional().nullable(),
  scopes: z.array(z.string()).optional().nullable(),
});

export const VolunteerListSchema = z.array(VolunteerSchema);

export const OrganizationSchema = OrganizationEditSchema.merge(
  HasIDSchema
).merge(
  z.object({
    imageUrl: z.string().optional().nullable(),
  })
);

export const OrganizationWithEventsSchema = OrganizationSchema.merge(
  z.object({ activities: ActivityListSchema })
);

export const OrganizationListSchema = z.array(OrganizationSchema);

export type OrganizationEdit = z.infer<typeof OrganizationEditSchema>;
