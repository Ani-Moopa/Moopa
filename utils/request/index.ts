import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

function isAnilist(url: string | undefined): boolean {
  return url?.includes("anilist.co") ?? false;
}

interface RequestOption extends RequestInit {
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
}

const pls = {
  // GET request handler
  async get(
    url: string,
    options?: AxiosRequestConfig,
    ctx?: any
  ): Promise<any> {
    try {
      const session: any | null = isAnilist(url) ? await getSession(ctx) : null;
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await axios.get(url, { ...options, signal });
      return response.data;
    } catch (error: any) {
      handleError(error);
      //   throw error;
    }
  },

  // POST request handler
  async post(url: string, options: RequestOption, ctx?: any): Promise<any> {
    try {
      const session: any | null = await getSession(ctx);
      const accessToken: string | undefined = session?.user?.token;

      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken &&
            isAnilist(url) && { Authorization: `Bearer ${accessToken}` }),
        },
        ...options,
        signal,
      });

      const data = await response.json();
      return [data, session];
    } catch (error: any) {
      handleError(error);
      //   throw error;
    }
  },
};

function handleError(error: {
  response: { status: any; data: any };
  message: any;
}) {
  console.log(error);
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        toast.error("400 Bad request", {
          description: data?.message || error.message,
        });
        break;
      case 401:
        toast.error("401 Unauthorized", {
          description: data?.message || error.message,
        });
        break;
      case 403:
        toast.error("403 Forbidden", {
          description: data?.message || error.message,
        });
        break;
      case 404:
        toast.error(`Resource not found - 404`, {
          description: data?.message || error.message,
        });
        break;
      case 500:
        toast.error("500 Internal server error", {
          description: data?.message || error.message,
        });
        break;
      default:
        toast.error("An error occurred", {
          description: data?.message || error.message,
        });
        break;
    }

    if (data && data.message) {
      console.error("Error message:", data.message);
    }
  }
}

export default pls;
