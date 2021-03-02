import { ApiError, ApiResponse } from '../types/api';

/**
 * Returns true if the given response object is an error object, false otherwise.
 *
 * More information on user-defined type guards:
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 *
 * @param response - JSON response object from API
 */
export function isError<T>(response: ApiResponse<T>): response is ApiError {
  return (response as ApiError).errorCode !== undefined;
}
