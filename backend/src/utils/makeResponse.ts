/**
 * Creates a response object with the specified status, message, and data.
 * @param success - The status of the response.
 * @param message - The message of the response.
 * @param data - The data of the response.
 * @returns The response object.
 */
export function makeResponse(success: boolean, message: string, data: any) {
  return {
    success,
    message,
    data,
  };
}
