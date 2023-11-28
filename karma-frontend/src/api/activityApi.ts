import { z } from "zod";
import { VoidSchema } from "../models/Common";
import {
  ActivityListSchema,
  ActivityWithFeedbackSchema,
} from "../models/Activity";
import api, { HTTPMethod } from "./api";

export const getOrganizationActivities = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof ActivityListSchema>,
  { organizationId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/events",
  requestSchema: VoidSchema,
  responseSchema: ActivityListSchema,
});

export const getActivity = api<
  z.infer<typeof VoidSchema>,
  Zod.infer<typeof ActivityWithFeedbackSchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/events/:activityId",
  requestSchema: VoidSchema,
  responseSchema: ActivityWithFeedbackSchema,
});
