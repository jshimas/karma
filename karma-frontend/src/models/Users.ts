import { z } from "zod";

export const UserUpdateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
});

export const UserSchema = UserUpdateSchema.merge(
  z.object({
    id: z.string(),
    email: z.string().email(),
  })
);
