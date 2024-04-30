import { z } from "zod";
import api, { HTTPMethod } from "./api";
import multipartApi from "./multipartApi";
import { EmptySchema, VoidSchema } from "../models/Common";
import {
  OrganizationEditSchema,
  OrganizationListSchema,
  OrganizationSchema,
  OrganizationWithEventsSchema,
  VolunteerListRequestSchema,
  VolunteerListSchema,
} from "../models/Organization";
import { UserIdsSchema } from "../models/Participation";

export const getOrganization = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof OrganizationWithEventsSchema>,
  { id: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:id",
  requestSchema: VoidSchema,
  responseSchema: OrganizationWithEventsSchema,
});

export const getAllOrganizations = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof OrganizationListSchema>,
  undefined
>({
  method: HTTPMethod.GET,
  path: "/organizations",
  requestSchema: VoidSchema,
  responseSchema: OrganizationListSchema,
});

export const createOrganization = multipartApi<
  z.infer<typeof OrganizationSchema>,
  undefined
>({
  method: HTTPMethod.POST,
  path: "/organizations",
  responseSchema: OrganizationSchema,
});

export const updateOrganization = multipartApi<
  z.infer<typeof OrganizationWithEventsSchema>,
  { id: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:id",
  responseSchema: OrganizationWithEventsSchema,
});

export const deleteOrganization = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof EmptySchema>,
  { id: string }
>({
  method: HTTPMethod.DELETE,
  path: "/organizations/:id",
  requestSchema: VoidSchema,
  responseSchema: EmptySchema,
});

export const getOrganizationVolunteers = api<
  z.infer<typeof VolunteerListRequestSchema>,
  z.infer<typeof VolunteerListSchema>,
  { organizationId: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:organizationId/volunteers",
  requestSchema: VolunteerListRequestSchema,
  responseSchema: VolunteerListSchema,
});

export const cancelPartnership = api<
  z.infer<typeof UserIdsSchema>,
  z.infer<typeof EmptySchema>,
  { organizationId: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:organizationId/volunteers/cancel-partnership",
  requestSchema: UserIdsSchema,
  responseSchema: EmptySchema,
});
