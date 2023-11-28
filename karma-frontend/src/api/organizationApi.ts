import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { EmptySchema, VoidSchema } from "../models/Common";
import {
  OrganizationEditSchema,
  OrganizationListSchema,
  OrganizationSchema,
  OrganizationWithEventsSchema,
} from "../models/Organization";

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

export const createOrganization = api<
  z.infer<typeof OrganizationEditSchema>,
  z.infer<typeof OrganizationSchema>,
  undefined
>({
  method: HTTPMethod.POST,
  path: "/organizations",
  requestSchema: OrganizationEditSchema,
  responseSchema: OrganizationSchema,
});

export const updateOrganization = api<
  z.infer<typeof OrganizationEditSchema>,
  z.infer<typeof OrganizationWithEventsSchema>,
  { id: string }
>({
  method: HTTPMethod.PUT,
  path: "/organizations/:id",
  requestSchema: OrganizationEditSchema,
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
