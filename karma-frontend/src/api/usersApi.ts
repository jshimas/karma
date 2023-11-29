import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { EmptySchema, VoidSchema } from "../models/Common";
import { UserSchema, UserCreateSchema } from "../models/Users";

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

export const createUser = api<
  z.infer<typeof UserCreateSchema>,
  z.infer<typeof EmptySchema>,
  null
>({
  method: HTTPMethod.POST,
  path: "/users",
  requestSchema: UserCreateSchema,
  responseSchema: EmptySchema,
});
