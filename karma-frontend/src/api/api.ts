import axios from "axios";
import type { z } from "zod";
import Cookies from "js-cookie";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

interface ApiConfig<Request, Response> {
  method: HTTPMethod;
  path: string;
  requestSchema: z.ZodType<Request>;
  responseSchema: z.ZodType<Response>;
}

export default function api<Request, Response, Parameters>({
  method,
  path,
  requestSchema,
  responseSchema,
}: ApiConfig<Request, Response>): ({
  data,
  params,
}: {
  data?: Request;
  params?: Parameters;
}) => Promise<Response> {
  return function ({ data, params }) {
    requestSchema.parse(data);

    console.log("api call", method, path, data, params);

    const headers: Record<string, string> = {};

    const jwt: string | undefined = Cookies.get("jwt");
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }

    async function apiCall() {
      const updatedPath = buildUrlWithParams(path, params);
      const response = await axios({
        baseURL: "http://127.0.0.1:8080/api/v1",
        method,
        url: updatedPath,
        [method === HTTPMethod.GET ? "params" : "data"]: data,
        paramsSerializer: {
          indexes: null,
        },
        headers,
      });

      return responseSchema.parse(response.data);
    }

    function buildUrlWithParams(path: string, params?: Parameters): string {
      if (!params) {
        return path;
      }

      let updatedPath = path;
      Object.entries(params).forEach(([key, value]) => {
        updatedPath = updatedPath.replace(`:${key}`, String(value));
      });

      return updatedPath;
    }

    return apiCall();
  };
}
