import { cookies } from "next/headers";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export const SESSION_COOKIE_NAME = "qaryz_session";

export class BackendApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

function getBackendUrl(path: string) {
  const baseUrl = process.env.BACKEND_URL ?? "https://qaryz-be.onrender.com";
  return new URL(path, baseUrl).toString();
}

export function getPublicBackendUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_ORIGIN ??
    process.env.BACKEND_PUBLIC_ORIGIN ??
    "https://qaryz-be.onrender.com";
  return new URL(path, baseUrl).toString();
}

function reviveDates(_key: string, value: unknown) {
  if (typeof value === "string" && ISO_DATE_PATTERN.test(value)) {
    return new Date(value);
  }

  return value;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text, reviveDates) : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Backend request failed";

    throw new BackendApiError(message, response.status);
  }

  return payload as T;
}

function withAuthHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  const cookieHeader = cookies().toString();

  if (cookieHeader) {
    nextHeaders.set("cookie", cookieHeader);
  }

  return nextHeaders;
}

export async function backendGet<T>(path: string) {
  const response = await fetch(getBackendUrl(path), {
    headers: withAuthHeaders(),
    cache: "no-store"
  });

  return parseResponse<T>(response);
}

export async function backendJson<T>(path: string, init: Omit<RequestInit, "body"> & { body?: unknown } = {}) {
  const headers = withAuthHeaders(init.headers);
  headers.set("content-type", "application/json");

  const response = await fetch(getBackendUrl(path), {
    ...init,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store"
  });

  return parseResponse<T>(response);
}

export async function backendForm<T>(path: string, formData: FormData, init: Omit<RequestInit, "body"> = {}) {
  const response = await fetch(getBackendUrl(path), {
    ...init,
    headers: withAuthHeaders(init.headers),
    body: formData,
    cache: "no-store"
  });

  return parseResponse<T>(response);
}
