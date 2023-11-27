import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().regex(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(100),
  refreshToken: z.string().min(10),
});

export const UserRegisterSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.string(),
    organizationId: z.string().optional(),
    password: z.string(),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export const AccessTokenRequestSchema = z.object({ refreshToken: z.string() });

export const AccessTokenResponseSchema = z.object({ accessToken: z.string() });

export type Login = z.infer<typeof LoginSchema>;
