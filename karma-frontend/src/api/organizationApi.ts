import { z } from "zod";
import api, { HTTPMethod } from "./api";
import { VoidSchema } from "../models/Common";
import {
  OrganizationListSchema,
  OrganizationSchema,
} from "../models/Organization";

export const getOrganization = api<
  z.infer<typeof VoidSchema>,
  z.infer<typeof OrganizationSchema>,
  { id: string }
>({
  method: HTTPMethod.GET,
  path: "/organizations/:id",
  requestSchema: VoidSchema,
  responseSchema: OrganizationSchema,
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
