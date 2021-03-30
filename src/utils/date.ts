/**
 * Abbreviates the given day by only taking the first 3 letters.
 *
 * @param day - The day to abbreviate
 */
export function abbreviate(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1, 3).toLowerCase();
}
