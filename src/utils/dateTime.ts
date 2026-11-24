
const TIME_ZONE = 'Asia/Kolkata';
const LOCALE = 'en-IN';

export const getIndiaDateString = (value: Date = new Date()): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
};

export const getNextIndiaMidnight = (timestamp: number = Date.now()): number => {
  const [year, month, day] = getIndiaDateString(new Date(timestamp))
    .split('-')
    .map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1))
    .toISOString()
    .slice(0, 10);

  return Date.parse(`${nextDate}T00:00:00+05:30`);
};

/** Format an ISO date/timestamp as 21 Oct 2026 in India time. */
export const formatMealDate = (value: string): string => {
  return new Date(value).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
};

/** Format an ISO timestamp as 21 October 2026. */
export const formatFullDate = (value: string): string => {
  return new Date(value).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
};

/** Format a time string such as "12:30:00" as 12:30 PM. */
export const formatMealTime = (
  value: string | null | undefined,
): string => {
  if (!value) return '';

  const [hours, minutes] = value.split(':').map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return value;
  }

  const date = new Date(2000, 0, 1, hours, minutes);

  return date.toLocaleTimeString(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  });
};

/** Format a meal's start and end time together. */
export const formatMealTimeRange = (
  startTime: string,
  endTime: string,
): string => {
  return `${formatMealTime(startTime)} – ${formatMealTime(endTime)}`;
};
