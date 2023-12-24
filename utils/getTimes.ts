export function convertUnixToTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-based index

  switch (month) {
    case 12:
    case 1:
    case 2:
      return "WINTER";
    case 3:
    case 4:
    case 5:
      return "SPRING";
    case 6:
    case 7:
    case 8:
      return "SUMMER";
    case 9:
    case 10:
    case 11:
      return "FALL";
    default:
      return "UNKNOWN SEASON";
  }
}

export function convertUnixToCountdown(time: number) {
  let date = new Date(time * 1000);
  let days = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  let countdown = "";

  if (days > 0) {
    countdown += `${days}d `;
  }

  if (hours > 0) {
    countdown += `${hours}h `;
  }

  if (minutes > 0) {
    countdown += `${minutes}m `;
  }

  return countdown.trim();
}

export function convertSecondsToTime(sec: number) {
  let days = Math.floor(sec / (3600 * 24));
  let hours = Math.floor((sec % (3600 * 24)) / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = Math.floor(sec % 60);

  let time = "";

  if (days > 0) {
    time += `${days}d `;
  }

  if (hours > 0) {
    time += `${hours}h `;
  }

  if (minutes > 0) {
    time += `${minutes}m `;
  }

  if (days <= 0) {
    time += `${seconds}s `;
  }

  return time.trim();
}

// Function to convert timestamp to AM/PM time format
export const timeStamptoAMPM = (timestamp: number | string) => {
  const date = new Date(Number(timestamp) * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const timeStamptoHour = (timestamp: number) => {
  const currentTime = new Date().getTime() / 1000;
  const formattedTime = new Date(timestamp * 1000).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "numeric", hour12: true }
  );
  const status = timestamp <= currentTime ? "aired" : "airing";

  return `${status} at ${formattedTime}`;
};

export function unixTimestampToRelativeTime(unixTimestamp: number) {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  let secondsDifference = now - unixTimestamp;

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const isFuture = secondsDifference < 0;
  secondsDifference = Math.abs(secondsDifference);

  for (const interval of intervals) {
    const count = Math.floor(secondsDifference / interval.seconds);
    if (count >= 1) {
      const label = count === 1 ? interval.label : `${interval.label}s`;
      return isFuture ? `${count} ${label} from now` : `${count} ${label} ago`;
    }
  }

  return "just now";
}

export function unixToSeconds(unixTimestamp: number) {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
  const secondsAgo = now - unixTimestamp;

  return secondsAgo;
}

export function realTimeCountdown(secondsLeft: number): string {
  let countdown = "";
  const intervalId = setInterval(() => {
    secondsLeft--;
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    countdown = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (secondsLeft <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
  return countdown;
}
