/**
 * Formats a time range in the format "HH[:MM]? AM|PM - HH[:MM]? AM|PM".
 *
 * @param startTime - The start time to parse
 * @param endTime - The end time to parse
 */
export function formatTime(startTime: string, endTime: string): string {
  const formatHour = (startTime: string): string => {
    const [hour, minute] = startTime.split(':');

    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);

    let formattedTime = `${hourNum === 12 ? hourNum : hourNum % 12}`;
    if (minuteNum !== 0) {
      formattedTime += `:${minuteNum}`;
    }
    formattedTime += hourNum < 12 ? ' AM' : ' PM';
    return formattedTime;
  };

  return formatHour(startTime) + ' - ' + formatHour(endTime);
}
