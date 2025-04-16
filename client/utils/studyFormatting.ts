export const formatTime = (inputSeconds: number) => {
  const seconds = Math.round(inputSeconds);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatToTime = (dateString: string) =>
  dateString
    ? new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

export const formatTimeLeft = (timeLeft: number) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
