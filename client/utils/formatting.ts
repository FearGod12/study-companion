export const formatTimeToHHMMSS = (time: string): string => {
  if (!time) return "00:00:00";
  const parts = time.split(":");
  return parts.length === 2 ? `${time}:00` : time; // Add seconds if missing
};

export const formatTitle = (title: string): string =>
  title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

export const formatDate = (dateStr: string, locale: string = "en-US"): string =>
  new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatTime = (timeStr: string, locale: string = "en-US"): string =>
  new Date(`1970-01-01T${timeStr}`).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });