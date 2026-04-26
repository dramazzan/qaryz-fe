export function normalizeReturnTo(value: string | null | undefined) {
  if (!value) {
    return "/";
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > 2048 || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/";
  }

  try {
    const url = new URL(trimmed, "https://qaryz.local");
    const path = `${url.pathname}${url.search}${url.hash}`;

    return path.startsWith("/login") || path.startsWith("/auth/complete") ? "/" : path;
  } catch {
    return "/";
  }
}

export function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
