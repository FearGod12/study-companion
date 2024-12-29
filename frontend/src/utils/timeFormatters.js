export const formatTime = (inputSeconds) => {
  const seconds = Math.round(inputSeconds);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatToTime = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
