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
    organizationId: z.string().uuid().optional(),
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

export type UserCreate = z.infer<typeof UserCreateSchema>;
