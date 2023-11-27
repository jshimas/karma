import { z } from "zod";
import { VoidSchema } from "../models/Common";
import { ActivityListSchema } from "../models/Activity";
import api, { HTTPMethod } from "./api";

export const getAllActivities = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof ActivityListSchema>,
  { organizationId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/events",
  requestSchema: VoidSchema,
  responseSchema: ActivityListSchema,
});
