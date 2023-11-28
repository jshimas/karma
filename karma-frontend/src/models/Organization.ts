import { z } from "zod";
import { HasIDSchema } from "./Common";
import { ActivityListSchema } from "./Activity";

export const OrganizationEditSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/),
  type: z.string(),
  mission: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((value) => value?.indexOf(".") !== -1, {
      message: "Invalid website URL",
    }),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
});

export const OrganizationSchema = OrganizationEditSchema.merge(HasIDSchema);

export const OrganizationWithEventsSchema = OrganizationSchema.merge(
  z.object({ events: ActivityListSchema })
);

export const OrganizationListSchema = z.array(OrganizationSchema);

export type OrganizationEdit = z.infer<typeof OrganizationEditSchema>;
