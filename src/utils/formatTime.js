export function formatTimeToHHMM(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0'); // Pad with leading 0 if needed
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad with leading 0 if needed
    return `${hours}:${minutes}`;
  }