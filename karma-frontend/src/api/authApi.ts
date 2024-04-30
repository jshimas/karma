import { z } from "zod";
import api, { HTTPMethod } from "./api";
import {
  AccessTokenResponseSchema,
  GoogleRedirectUrlRequestSchema,
  GoogleRedirectUrlResponseSchema,
  LoginSchema,
  SendOrganizerInvitationRequestSchema,
} from "../models/Authentication";
import {
  EmptySchema,
  ValidationResponseSchema,
  VoidSchema,
} from "../models/Common";
import { GoogleUserCreateSchema } from "../models/Users";

export const login = api<
  z.infer<typeof LoginSchema>,
  z.infer<typeof AccessTokenResponseSchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/login",
  requestSchema: LoginSchema,
  responseSchema: AccessTokenResponseSchema,
});

export const logout = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof VoidSchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/logout",
  requestSchema: VoidSchema,
  responseSchema: VoidSchema,
});

export const getGoogleSignupRedirectUrl = api<
  z.infer<typeof GoogleRedirectUrlRequestSchema>,
  z.infer<typeof GoogleRedirectUrlResponseSchema>,
  null
>({
  method: HTTPMethod.GET,
  path: "/oauth2/google/signup-url",
  requestSchema: GoogleRedirectUrlRequestSchema,
  responseSchema: GoogleRedirectUrlResponseSchema,
});

export const getGoogleLoginRedirectUrl = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof GoogleRedirectUrlResponseSchema>,
  null
>({
  method: HTTPMethod.GET,
  path: "/oauth2/google/login-url",
  requestSchema: VoidSchema,
  responseSchema: GoogleRedirectUrlResponseSchema,
});

export const createGoogleUser = api<
  z.infer<typeof GoogleUserCreateSchema>,
  z.infer<typeof AccessTokenResponseSchema>,
  { code: string }
>({
  method: HTTPMethod.POST,
  path: "/oauth2/google/signup?code=:code",
  requestSchema: GoogleUserCreateSchema,
  responseSchema: AccessTokenResponseSchema,
});

export const loginGoogleUser = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof AccessTokenResponseSchema>,
  { code: string }
>({
  method: HTTPMethod.POST,
  path: "/oauth2/google/login?code=:code",
  requestSchema: VoidSchema,
  responseSchema: AccessTokenResponseSchema,
});

export const sendOrganizerInvitation = api<
  z.infer<typeof SendOrganizerInvitationRequestSchema>,
  z.infer<typeof EmptySchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/send-organizer-invitation",
  requestSchema: SendOrganizerInvitationRequestSchema,
  responseSchema: EmptySchema,
});

export const validateRegistrationToken = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof ValidationResponseSchema>,
  { token: string }
>({
  method: HTTPMethod.GET,
  path: "/validate-registration-token?token=:token",
  requestSchema: VoidSchema,
  responseSchema: ValidationResponseSchema,
});
