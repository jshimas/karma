import { z } from "zod";
import { EmptySchema, VoidSchema } from "../models/Common";
import {
  ActivitiesRequestSchema,
  ActivityEditSchema,
  ActivityListSchema,
  ActivitySchema,
  ActivityWithFeedbackSchema,
  UserActivityApplicationSchema,
  ResolveActivitySchema,
} from "../models/Activity";
import api, { HTTPMethod } from "./api";
import {
  ActivityApplicationRequestSchema,
  ApplicationEditSchema,
  ApplicationListSchema,
} from "../models/Application";
import {
  UserIdsSchema,
  ParticipationEditSchema,
  CertificateLinkResponseSchema,
} from "../models/Participation";

export const getActivities = api<
  z.infer<typeof ActivitiesRequestSchema>,
  z.infer<typeof ActivityListSchema>,
  null
>({
  method: HTTPMethod.GET,
  path: "/activities",
  requestSchema: ActivitiesRequestSchema,
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

export const applyToActivity = api<
  z.infer<typeof UserActivityApplicationSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.POST,
  path: "/organizations/:organizationId/activities/:activityId/applications",
  requestSchema: UserActivityApplicationSchema,
  responseSchema: EmptySchema,
});

export const getActivityApplications = api<
  z.infer<typeof ActivityApplicationRequestSchema>,
  z.infer<typeof ApplicationListSchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/activities/:activityId/applications",
  requestSchema: ActivityApplicationRequestSchema,
  responseSchema: ApplicationListSchema,
});

export const reviewApplication = api<
  z.infer<typeof ApplicationEditSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string; applicationId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/activities/:activityId/applications/:applicationId",
  requestSchema: ApplicationEditSchema,
  responseSchema: EmptySchema,
});

export const sendInvitations = api<
  z.infer<typeof UserIdsSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.POST,
  path: "/organizations/:organizationId/activities/:activityId/participations",
  requestSchema: UserIdsSchema,
  responseSchema: EmptySchema,
});

export const updateInvitation = api<
  z.infer<typeof ParticipationEditSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string; participationId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/activities/:activityId/participations/:participationId",
  requestSchema: ParticipationEditSchema,
  responseSchema: EmptySchema,
});

export const resolveActivity = api<
  z.infer<typeof ResolveActivitySchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string; activityId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/activities/:activityId/resolve",
  requestSchema: ResolveActivitySchema,
  responseSchema: EmptySchema,
});

export const getCertificate = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof CertificateLinkResponseSchema>,
  { organizationId: string; activityId: string; participationId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/activities/:activityId/participations/:participationId/certificate",
  requestSchema: VoidSchema,
  responseSchema: CertificateLinkResponseSchema,
});
