/**
 * Represents an error that occurs when an operation is aborted.
 */
class CustomError extends Error {
  statusCode: number;

  /**
   * Creates a new instance of the `CustomError` class.
   * @param statusCode The status code associated with the error.
   * @param message The error message.
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { CustomError };
