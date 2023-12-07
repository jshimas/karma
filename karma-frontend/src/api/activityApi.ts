import { z } from "zod";
import { EmptySchema, VoidSchema } from "../models/Common";
import {
  ActivityEditSchema,
  ActivityListSchema,
  ActivitySchema,
  ActivityWithFeedbackSchema,
} from "../models/Activity";
import api, { HTTPMethod } from "./api";

export const getOrganizationActivities = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof ActivityListSchema>,
  { organizationId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/activities",
  requestSchema: VoidSchema,
  responseSchema: ActivityListSchema,
});

export const getActivity = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof ActivityWithFeedbackSchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/activities/:activityId",
  requestSchema: VoidSchema,
  responseSchema: ActivityWithFeedbackSchema,
});

export const createActivity = api<
  z.infer<typeof ActivityEditSchema>,
  z.infer<typeof ActivitySchema>,
  { organizationId: string }
>({
  method: HTTPMethod.POST,
  path: "/organizations/:organizationId/activities",
  requestSchema: ActivityEditSchema,
  responseSchema: ActivitySchema,
});

export const updateActivity = api<
  z.infer<typeof ActivityEditSchema>,
  z.infer<typeof ActivityWithFeedbackSchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/activities/:activityId",
  requestSchema: ActivityEditSchema,
  responseSchema: ActivityWithFeedbackSchema,
});

export const deleteActivity = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.DELETE,
  path: "/organizations/:organizationId/activities/:activityId",
  requestSchema: VoidSchema,
  responseSchema: EmptySchema,
});
