import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email")
    .email("Please provide a valid email"),
  password: z.string(),
});

export const GoogleRedirectUrlRequestSchema = z.object({
  token: z.string().optional().nullable(),
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

export const SendOrganizerInvitationRequestSchema = z.object({
  toEmail: z.string().email(),
  fromEmail: z.string().email(),
  fromName: z.string(),
  organizationName: z.string(),
});

export const AccessTokenResponseSchema = z.object({ accessToken: z.string() });

export type Login = z.infer<typeof LoginSchema>;
