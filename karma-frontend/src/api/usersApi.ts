import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { VoidSchema } from "../models/Common";
import { UserSchema } from "../models/Users";

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
