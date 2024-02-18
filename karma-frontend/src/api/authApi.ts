import { z } from "zod";
import api, { HTTPMethod } from "./api";
import {
  AccessTokenRequestSchema,
  AccessTokenResponseSchema,
  GoogleRedirectUrlResponseSchema,
  LoginResponseSchema,
  LoginSchema,
} from "../models/Authentication";
import { VoidSchema } from "../models/Common";
import { GoogleUserCreateSchema } from "../models/Users";

export const login = api<
  z.infer<typeof LoginSchema>,
  z.infer<typeof LoginResponseSchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/login",
  requestSchema: LoginSchema,
  responseSchema: LoginResponseSchema,
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

export const refreshAccessToken = api<
  z.infer<typeof AccessTokenRequestSchema>,
  z.infer<typeof AccessTokenResponseSchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/refresh-token",
  requestSchema: AccessTokenRequestSchema,
  responseSchema: AccessTokenResponseSchema,
});

export const getGoogleSignupRedirectUrl = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof GoogleRedirectUrlResponseSchema>,
  null
>({
  method: HTTPMethod.GET,
  path: "/oauth2/google/signup-url",
  requestSchema: VoidSchema,
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
