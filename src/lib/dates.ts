export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatForDateInput(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}
