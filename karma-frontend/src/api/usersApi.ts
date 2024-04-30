import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { EmptySchema, VoidSchema } from "../models/Common";
import { UserSchema, UserCreateSchema, UserEditSchema } from "../models/Users";
import multipartApi from "./multipartApi";

export const getCurrentUser = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof UserSchema>,
  null
>({
  method: HTTPMethod.GET,
  path: "/users/me",
  requestSchema: VoidSchema,
  responseSchema: UserSchema,
});

export const getUser = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof UserSchema>,
  { userId: string }
>({
  method: HTTPMethod.GET,
  path: "/users/:userId",
  requestSchema: VoidSchema,
  responseSchema: UserSchema,
});

export const createUser = api<
  z.infer<typeof UserCreateSchema>,
  z.infer<typeof EmptySchema>,
  null
>({
  method: HTTPMethod.POST,
  path: `/users`,
  requestSchema: UserCreateSchema,
  responseSchema: EmptySchema,
});

export const updateUser = api<
  z.infer<typeof UserEditSchema>,
  z.infer<typeof EmptySchema>,
  null
>({
  method: HTTPMethod.PUT,
  path: "/users/me",
  requestSchema: UserEditSchema,
  responseSchema: EmptySchema,
});

export const updateProfileImage = multipartApi<
  z.infer<typeof EmptySchema>,
  null
>({
  method: HTTPMethod.PUT,
  path: "/users/me/image",
  responseSchema: EmptySchema,
});
