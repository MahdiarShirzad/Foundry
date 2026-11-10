const DEFAULT_API_BASE_URL = "http://localhost:8000";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  /** Machine-readable code from the API body (`code`), when it sends one. */
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends RequestInit {
  json?: unknown;
}

let refreshPromise: Promise<boolean> | null = null;

async function performRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function rawFetch<T>(
  path: string,
  { json, ...options }: RequestOptions,
): Promise<{ res: Response; data: T | null }> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: json !== undefined ? JSON.stringify(json) : options.body,
  });

  if (res.status === 204) {
    return {
      res,
      data: null,
    };
  }

  const data = await res.json().catch(() => null);

  return { res, data };
}

async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { res, data } = await rawFetch<T>(path, options);

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const isAuthEndpoint =
      path.startsWith("/auth/refresh") ||
      path.startsWith("/auth/login") ||
      path.startsWith("/auth/register") ||
      path.startsWith("/auth/logout");

    if (res.status === 401 && !isRetry && !isAuthEndpoint) {
      const refreshed = await performRefresh();
      if (refreshed) {
        return apiFetch<T>(path, options, true);
      }
    }

    const body =
      typeof data === "object" && data !== null
        ? (data as Record<string, unknown>)
        : null;

    const message =
      (typeof body?.message === "string" ? body.message : null) ||
      `Request failed with ${res.status}`;

    throw new ApiError(
      message,
      res.status,
      typeof body?.code === "string" ? body.code : undefined,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, json?: unknown) =>
    apiFetch<T>(path, { method: "POST", json }),
  patch: <T>(path: string, json?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", json }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
