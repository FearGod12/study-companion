import { DateTime } from 'luxon';

// Nigeria timezone
export const NIGERIA_TIMEZONE = 'Africa/Lagos';

/**
 * Parse a date string in YYYY-MM-DD format to a Date object in Nigeria timezone
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in Nigeria timezone
 */
export function parseDateString(dateString: string): Date {
  return DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: NIGERIA_TIMEZONE }).toJSDate();
}

/**
 * Parse a time string in HH:MM:SS format to a Date object in Nigeria timezone
 * @param timeString - Time string in HH:MM:SS format
 * @returns Date object in Nigeria timezone
 */
export function parseTimeString(timeString: string): Date {
  return DateTime.fromFormat(timeString, 'HH:mm:ss', { zone: NIGERIA_TIMEZONE }).toJSDate();
}

/**
 * Combine a date string and time string into a Date object in Nigeria timezone
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM:SS format
 * @returns Date object in Nigeria timezone
 */
export function combineDateAndTime(dateString: string, timeString: string) {
  // First parse the date and time separately
  const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd', { zone: NIGERIA_TIMEZONE });
  const time = DateTime.fromFormat(timeString, 'HH:mm:ss', { zone: NIGERIA_TIMEZONE });

  // Then combine them and set the timezone
  return DateTime.fromObject({
    year: date.year,
    month: date.month,
    day: date.day,
    hour: time.hour,
    minute: time.minute,
    second: time.second,
  }).setZone(NIGERIA_TIMEZONE);
}

/**
 * Get today's date at midnight in Nigeria timezone
 * @returns Date object representing today at midnight in Nigeria timezone
 */
export function getTodayInNigeria(): Date {
  return DateTime.now().setZone(NIGERIA_TIMEZONE).startOf('day').toJSDate();
}

/**
 * Format a Date object to a string in Nigeria timezone
 * @param date - Date object to format
 * @param format - Format string (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export function formatDateInNigeria(date: Date, format: string = 'yyyy-MM-dd'): string {
  return DateTime.fromJSDate(date).setZone(NIGERIA_TIMEZONE).toFormat(format);
}

/**
 * Format a Date object to a time string in Nigeria timezone
 * @param date - Date object to format
 * @param format - Format string (default: 'HH:mm')
 * @returns Formatted time string
 */
export function formatTimeInNigeria(date: Date, format: string = 'HH:mm'): string {
  return DateTime.fromJSDate(date).setZone(NIGERIA_TIMEZONE).toFormat(format);
}

/**
 * Add a number of minutes to a Date object in Nigeria timezone
 * @param date - Date object to add minutes to
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New Date object with minutes added
 */
export function addMinutesInNigeria(date: Date, minutes: number): Date {
  return DateTime.fromJSDate(date).setZone(NIGERIA_TIMEZONE).plus({ minutes }).toJSDate();
}

/**
 * Check if a date is in the past relative to today in Nigeria timezone
 * @param date - Date to check
 * @returns true if the date is in the past, false otherwise
 */
export function isDateInPast(date: DateTime): boolean {
  const now = DateTime.now().setZone(NIGERIA_TIMEZONE);
  const dateToCheck = date;
  return dateToCheck < now;
}
