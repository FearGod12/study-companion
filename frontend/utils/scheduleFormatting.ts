export const formatTimeToHHMMSS = (time: string): string => {
  if (!time) return "00:00:00";
  const date = new Date(time);
  if (isNaN(date.getTime())) {
    // fallback if it's already in HH:MM
    const parts = time.split(":");
    if (parts.length === 2) return `${time}:00`;
    return time;
  }

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};


export const formatTitle = (title?: string): string => {
  if (!title) return "";
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
};

export const formatDate = (dateStr: string, locale: string = "en-US"): string =>
  new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatTime = (dateTimeStr: string, locale = "en-US") => {
  return new Date(dateTimeStr).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatToHHMM = (time: string): string => {
  const date = new Date(time);
  if (isNaN(date.getTime())) return time;

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");


  return `${hours}:${minutes}`;
};

export const isToday = (dateStr: string) => {
  const today = new Date();
  const selectedDate = new Date(dateStr);
  return (
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate()
  );
};

export const getCurrentTimeHHMM = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};