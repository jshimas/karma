import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email")
    .email("Please provide a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(100),
  refreshToken: z.string().min(10),
});

export const GoogleRedirectUrlResponseSchema = z.object({
  redirectUrl: z.string().min(1),
});

export const GoogleProfileResponseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string(),
});

export const AccessTokenRequestSchema = z.object({ refreshToken: z.string() });

export const AccessTokenResponseSchema = z.object({ accessToken: z.string() });

export type Login = z.infer<typeof LoginSchema>;
