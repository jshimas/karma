import { z } from "zod";
import { GeoPointDTOSchema } from "./Activity";

const EditUserLocation = z.object({
  name: z.string(),
  address: z.string(),
  location: GeoPointDTOSchema,
});

const UserLocationSchema = EditUserLocation.merge(
  z.object({
    id: z.string().uuid(),
  })
);

export const UserEditSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  bio: z.string().nullish(),
  scopes: z.array(z.string()),
  geoLocations: z.array(EditUserLocation),
});

export const UserSchema = UserEditSchema.merge(
  z.object({
    id: z.string(),
    email: z.string().email(),
    organizationId: z.string().uuid().nullish(),
    collectedHours: z.number(),
    geoLocations: z.array(UserLocationSchema),
  })
);

export const UserCreateSchema = z
  .object({
    firstName: z
      .string()
      .min(1)
      .max(255)
      .refine((val) => val.trim().length > 0, {
        message: "First name must not be empty or contain only whitespaces",
      }),
    lastName: z
      .string()
      .min(1)
      .max(255)
      .refine((val) => val.trim().length > 0, {
        message: "Last name must not be empty or contain only whitespaces",
      }),
    email: z.string().email(),
    role: z.string().min(1, "Role is required"),
    organizationId: z.string().uuid().optional(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const GoogleUserCreateSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type GoogleUserCreate = z.infer<typeof GoogleUserCreateSchema>;
export type UserEdit = z.infer<typeof UserEditSchema>;
export type UserLocation = z.infer<typeof UserLocationSchema>;
