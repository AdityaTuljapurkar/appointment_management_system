/**
 * Utility functions for handling Indian Standard Time (IST - Asia/Kolkata, UTC+5:30)
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Formats a Date object, timestamp, or ISO string to a human-readable IST string.
 * Example output: "14 Nov 2026, 02:30 PM IST"
 */
export const formatToIST = (dateInput, options = {}) => {
  if (!dateInput) return '';
  const date =
    typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput;

  if (isNaN(date.getTime())) return '';

  const defaultOptions = {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
};

/**
 * Converts a datetime-local input value ("YYYY-MM-DDTHH:mm") to an ISO-8601 string
 * explicitly stamped with the Indian Standard Time (+05:30) offset.
 * Example input: "2026-11-14T14:30"
 * Example output: "2026-11-14T14:30:00+05:30"
 */
export const toISTISOString = (dateTimeLocalValue) => {
  if (!dateTimeLocalValue) return '';
  if (dateTimeLocalValue.includes('+') || dateTimeLocalValue.endsWith('Z')) {
    return dateTimeLocalValue;
  }
  const base =
    dateTimeLocalValue.length === 16 ? `${dateTimeLocalValue}:00` : dateTimeLocalValue;
  return `${base}+05:30`;
};
