import { z } from "zod";
import api, { HTTPMethod } from "./api";
import {
  AccessTokenRequestSchema,
  AccessTokenResponseSchema,
  LoginResponseSchema,
  LoginSchema,
} from "../models/Authentication";
import { VoidSchema } from "../models/Common";

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
